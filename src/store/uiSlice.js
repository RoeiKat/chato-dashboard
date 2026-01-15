import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "ui",
  initialState: { createAppOpen: false },
  reducers: {
    openCreateApp(s) { s.createAppOpen = true; },
    closeCreateApp(s) { s.createAppOpen = false; },
  },
});

export const { openCreateApp, closeCreateApp } = slice.actions;
export default slice.reducer;
