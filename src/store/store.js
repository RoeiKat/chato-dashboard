import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import apps from "./appsSlice";
import ui from "./uiSlice";

export const store = configureStore({
  reducer: { auth, apps, ui },
});
