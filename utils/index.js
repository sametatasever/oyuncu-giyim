import {
  changeDesktopMenuIndex,
  changeMobileMenuIndex,
  CHANGE_DESKTOP_MENU_INDEX,
} from "../store/reducers/menu";
import { toggleIconMode } from "../store/reducers/theme";

export function handleIconMode(store, req) {
  if (req.cookies.iconMode && req.cookies.iconMode === "true") {
    store.dispatch(toggleIconMode());
  }
}

export function handleMenuIndex(store, data) {
  if (data.page) {
    const { desktop_menu_id, mobile_menu_id } = data.page;
    store.dispatch(changeDesktopMenuIndex(desktop_menu_id || -1));
    store.dispatch(changeMobileMenuIndex(mobile_menu_id || -1));
  }
}
