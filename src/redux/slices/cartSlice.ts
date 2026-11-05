import { CartItem } from "@/context/CartContext";
export type { CartItem };

export const addToCart = (payload: any) => ({ type: "cart/addToCart", payload });
export const removeFromCart = (payload: any) => ({ type: "cart/removeFromCart", payload });
export const increaseQuantity = (payload: any) => ({ type: "cart/increaseQuantity", payload });
export const decreaseQuantity = (payload: any) => ({ type: "cart/decreaseQuantity", payload });
export const updateQuantity = (payload: any) => ({ type: "cart/updateQuantity", payload });
export const clearCart = () => ({ type: "cart/clearCart" });
export const openMiniCart = () => ({ type: "cart/openMiniCart" });
export const closeMiniCart = () => ({ type: "cart/closeMiniCart" });
export const setPlacingOrder = (payload?: any) => ({ type: "cart/setPlacingOrder", payload });

export default function cartReducer(state = {}, action: any) {
  return state;
}
