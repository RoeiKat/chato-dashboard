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
    setAppRealtimeMeta(state, action) {
      const { apiKey, unread, sessionsCount, activeCount } = action.payload;
      const app = state.items.find((a) => a.apiKey === apiKey);
      if (!app) return;
      app.unread = unread ?? app.unread ?? 0;
      app.sessionsCount = sessionsCount ?? app.sessionsCount ?? 0;
      app.activeCount = activeCount ?? app.activeCount ?? 0;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAppsThunk.fulfilled, (s, a) => {
      s.items = a.payload.map((x) => ({
        apiKey: x.apiKey,
        name: x.name,
        unread: 0,
        sessionsCount: 0,
        activeCount: 0,
      }));
    });

    b.addCase(createAppThunk.fulfilled, (s, a) => {
      s.items.unshift({
        apiKey: a.payload.apiKey,
        name: a.payload.name,
        unread: 0,
        sessionsCount: 0,
        activeCount: 0,
      });
    });

    b.addCase(deleteAppThunk.fulfilled, (s, a) => {
      s.items = s.items.filter((x) => x.apiKey !== a.payload.apiKey);
    });
  },
});

export const { setAppRealtimeMeta } = slice.actions;
export default slice.reducer;
