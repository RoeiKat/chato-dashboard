import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { appsApi } from "../api/appsApi";

export const fetchAppsThunk = createAsyncThunk("apps/fetch", async ({ token }) => {
  const { apps } = await appsApi.list(token);
  return apps;
});

export const createAppThunk = createAsyncThunk("apps/create", async ({ token, name }) => {
  const { apiKey } = await appsApi.create(token, name);
  return { apiKey, name };
});

export const deleteAppThunk = createAsyncThunk("apps/delete", async ({ token, apiKey }) => {
  await appsApi.remove(token, apiKey);
  return { apiKey };
});

const slice = createSlice({
  name: "apps",
  initialState: { items: [] },
  reducers: {
    setAppUnread(state, action) {
      const { apiKey, unread } = action.payload;
      const app = state.items.find((a) => a.apiKey === apiKey);
      if (app) app.unread = unread;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAppsThunk.fulfilled, (s, a) => {
      s.items = a.payload.map((x) => ({ apiKey: x.apiKey, name: x.name, unread: 0 }));
    });

    b.addCase(createAppThunk.fulfilled, (s, a) => {
      s.items.unshift({ ...a.payload, unread: 0 });
    });

    b.addCase(deleteAppThunk.fulfilled, (s, a) => {
      s.items = s.items.filter((x) => x.apiKey !== a.payload.apiKey);
    });
  },
});

export const { setAppUnread } = slice.actions;
export default slice.reducer;
