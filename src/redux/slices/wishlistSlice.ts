import { WishlistItem } from "@/context/WishlistContext";
export type { WishlistItem };

export const addToWishlist = (payload: any) => ({ type: "wishlist/addToWishlist", payload });
export const removeFromWishlist = (payload: any) => ({ type: "wishlist/removeFromWishlist", payload });
export const toggleWishlist = (payload: any) => ({ type: "wishlist/toggleWishlist", payload });
export const clearWishlist = () => ({ type: "wishlist/clearWishlist" });

export default function wishlistReducer(state = {}, action: any) {
  return state;
}
