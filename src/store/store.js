import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import apps from "./appsSlice";
import ui from "./uiSlice";
import dashboard from "./dashboardSlice";

export const store = configureStore({
  reducer: { auth, apps, ui, dashboard },
});
