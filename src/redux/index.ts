"use client";

import { useCart, CartItem } from "@/context/CartContext";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { useUI } from "@/context/UIContext";

export { ReduxProvider } from "./provider";

export interface RootState {
  cart: {
    items: (CartItem & { id?: string })[];
    totalQuantity: number;
    totalPrice: number;
    isMiniCartOpen: boolean;
    placingOrder?: boolean;
  };
  wishlist: {
    items: (WishlistItem & { id?: string })[];
    totalItems: number;
  };
  ui: {
    isMobileMenuOpen: boolean;
    isComplainModalOpen: boolean;
  };
}

export function useAppSelector<TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected {
  const cart = useCart();
  const wishlist = useWishlist();
  const ui = useUI();

  const state: RootState = {
    cart: {
      items: cart.items.map((i) => ({ ...i, id: i._id })),
      totalQuantity: cart.totalItems,
      totalPrice: cart.totalPrice,
      isMiniCartOpen: cart.isMiniCartOpen,
    },
    wishlist: {
      items: wishlist.items.map((i) => ({ ...i, id: i._id })),
      totalItems: wishlist.totalWishlistItems,
    },
    ui: {
      isMobileMenuOpen: ui.isMobileMenuOpen,
      isComplainModalOpen: ui.isComplainModalOpen,
    },
  };

  return selector(state);
}

export const useAppDispatch = () => {
  const cart = useCart();
  const wishlist = useWishlist();
  const ui = useUI();

  return (action: any) => {
    if (!action) return;
    if (typeof action === "function") {
      action({ cart, wishlist, ui });
      return;
    }

    switch (action.type) {
      case "cart/addToCart":
        cart.addToCart(action.payload);
        break;
      case "cart/removeFromCart":
        cart.removeFromCart(action.payload?.id || action.payload);
        break;
      case "cart/increaseQuantity":
        cart.increaseQuantity(action.payload?.id || action.payload);
        break;
      case "cart/decreaseQuantity":
        cart.decreaseQuantity(action.payload?.id || action.payload);
        break;
      case "cart/clearCart":
        cart.clearCart();
        break;
      case "cart/openMiniCart":
        cart.openMiniCart();
        break;
      case "cart/closeMiniCart":
        cart.closeMiniCart();
        break;
      case "wishlist/toggleWishlist":
        wishlist.toggleWishlist(action.payload);
        break;
      case "wishlist/removeFromWishlist":
        wishlist.removeFromWishlist(action.payload?.id || action.payload);
        break;
      case "wishlist/clearWishlist":
        wishlist.clearWishlist();
        break;
      case "ui/openMobileMenu":
        ui.openMobileMenu();
        break;
      case "ui/closeMobileMenu":
        ui.closeMobileMenu();
        break;
      case "ui/toggleMobileMenu":
        ui.toggleMobileMenu();
        break;
      case "ui/openComplainModal":
        ui.openComplainModal();
        break;
      case "ui/closeComplainModal":
        ui.closeComplainModal();
        break;
    }
  };
};

// Export action helpers
export * from "./slices/cartSlice";
export * from "./slices/wishlistSlice";
export * from "./slices/uiSlice";
