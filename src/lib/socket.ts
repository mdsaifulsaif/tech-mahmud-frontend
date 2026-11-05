// lib/socket.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  orderID: string;
  orderNumber: string;
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: {
    area: string;
    city: string;
    houseNo?: string;
    road?: string;
  };
  itemCount: number;
  paymentMethod: string;
  createdAt: string;
  read: boolean;
  timestamp: string;
  area?: string;
  customerName?: string;
  customerPhone?: string;
}

export const useSocket = () => {
  const { data: session, status } = useSession();

  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const isInitialized = useRef(false);

  const addNotification = (data: any) => {
    const notificationArea = data.area || data.deliveryAddress?.area || "Unknown";

    const newNotification: Notification = {
      id: data.orderID || data.orderId || Date.now().toString(),
      orderID: data.orderID || data.orderId,
      orderNumber: data.orderNumber || `ORD-${Date.now()}`,
      totalAmount: data.totalAmount || data.amount || 0,
      deliveryFee: data.deliveryFee || data.deliveryCharge || 0,
      deliveryAddress: data.deliveryAddress || { area: "Unknown", city: "Unknown" },
      itemCount: data.itemCount || data.items || 0,
      paymentMethod: data.paymentMethod || "cod",
      createdAt: data.createdAt || new Date().toISOString(),
      read: false,
      timestamp: new Date().toISOString(),
      area: notificationArea,
      customerName: data.customerName || "Customer",
      customerPhone: data.customerPhone || "N/A",
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      setIsLoading(false);
      return;
    }

    if (isInitialized.current && socketRef.current) {
      return;
    }

    const userID = session.user.id;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
      "http://localhost:5001";

    const socket = io(socketUrl, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join-user-room", { userID });
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.warn("⚠️ Socket notice:", error?.message || error);
    });

    socket.on("order-update", (data: any) => {
      addNotification(data);
    });

    setIsLoading(false);
    isInitialized.current = true;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      isInitialized.current = false;
    };
  }, [status, session]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  return {
    socket: socketRef.current,
    isConnected,
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    setNotifications,
    setUnreadCount,
  };
};
