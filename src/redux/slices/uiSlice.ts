export const openMobileMenu = () => ({ type: "ui/openMobileMenu" });
export const closeMobileMenu = () => ({ type: "ui/closeMobileMenu" });
export const toggleMobileMenu = () => ({ type: "ui/toggleMobileMenu" });
export const openComplainModal = () => ({ type: "ui/openComplainModal" });
export const closeComplainModal = () => ({ type: "ui/closeComplainModal" });
export const openCartModal = () => ({ type: "cart/openMiniCart" });
export const closeCartModal = () => ({ type: "cart/closeMiniCart" });
export const toggleCartModal = () => ({ type: "cart/toggleMiniCart" });
export const openSearchModal = () => ({ type: "ui/openSearchModal" });
export const closeSearchModal = () => ({ type: "ui/closeSearchModal" });
export const openQuickView = (payload?: any) => ({ type: "ui/openQuickView", payload });
export const closeQuickView = () => ({ type: "ui/closeQuickView" });
export const openAuthModal = (payload?: any) => ({ type: "ui/openAuthModal", payload });
export const closeAuthModal = () => ({ type: "ui/closeAuthModal" });
export const setGlobalLoading = (payload?: any) => ({ type: "ui/setGlobalLoading", payload });
export const showNotification = (payload?: any) => ({ type: "ui/showNotification", payload });
export const hideNotification = () => ({ type: "ui/hideNotification" });
export const toggleFilterSidebar = () => ({ type: "ui/toggleFilterSidebar" });
export const closeFilterSidebar = () => ({ type: "ui/closeFilterSidebar" });
export const addToCompare = (payload?: any) => ({ type: "ui/addToCompare", payload });
export const removeFromCompare = (payload?: any) => ({ type: "ui/removeFromCompare", payload });
export const clearCompare = () => ({ type: "ui/clearCompare" });

export default function uiReducer(state = {}, action: any) {
  return state;
}
