import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { appsApi } from "../api/appsApi";

export const fetchAppsThunk = createAsyncThunk(
  "apps/fetch",
  async ({ token }) => {
    const { apps } = await appsApi.list(token);
    return apps;
  }
);

export const createAppThunk = createAsyncThunk(
  "apps/create",
  async ({ token, name }) => {
    const { apiKey } = await appsApi.create(token, name);
    return { apiKey, name };
  }
);

export const deleteAppThunk = createAsyncThunk(
  "apps/delete",
  async ({ token, apiKey }) => {
    await appsApi.remove(token, apiKey);
    return { apiKey };
  }
);

export const updateAppSettingsThunk = createAsyncThunk(
  "apps/updateSettings",
  async ({ token, apiKey, prechat, theme }) => {
    await appsApi.updateSettings(token, apiKey, { prechat, theme });
    return { apiKey, prechat, theme };
  }
);

const initialState = {
  items: [],
  status: "idle",     // idle | loading | succeeded | failed
  error: null,
};

const slice = createSlice({
  name: "apps",
  initialState,
  reducers: {
    // Firebase Real-time updates
    setAppRealtimeMeta(state, action) {
      const {
        apiKey,
        unread,
        sessionsCount,
        activeCount,
        messagesByDay,
      } = action.payload;

      const app = state.items.find((a) => a.apiKey === apiKey);
      if (!app) return;

      app.unread = unread ?? app.unread ?? 0;
      app.sessionsCount = sessionsCount ?? app.sessionsCount ?? 0;
      app.activeCount = activeCount ?? app.activeCount ?? 0;

      if (Array.isArray(messagesByDay) && messagesByDay.length === 7) {
        app.messagesByDay = messagesByDay;
      }
    },
  },
  extraReducers: (b) => {
    // Fetch apps
    b.addCase(fetchAppsThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    b.addCase(fetchAppsThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload.map((x) => ({
        apiKey: x.apiKey,
        name: x.name,

        theme: x.theme || {
          bubbleBg: "",
          primary: "",
          iconSvg: "",
          title: "",
        },

        prechat: x.prechat || {
          q1: "",
          q2: "",
          q3: "",
          faqUrl: "",
        },

        unread: 0,
        sessionsCount: 0,
        activeCount: 0,
        messagesByDay: [0, 0, 0, 0, 0, 0, 0],
      }));
    });

    b.addCase(fetchAppsThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error =
        action.error?.message || "Failed to load apps (backend cold start)";
    });

    // Create apps
    b.addCase(createAppThunk.fulfilled, (state, action) => {
      state.items.unshift({
        apiKey: action.payload.apiKey,
        name: action.payload.name,

        theme: {
          bubbleBg: "",
          primary: "",
          iconSvg: "",
          title: "",
        },

        prechat: {
          q1: "",
          q2: "",
          q3: "",
          faqUrl: "",
        },

        unread: 0,
        sessionsCount: 0,
        activeCount: 0,
        messagesByDay: [0, 0, 0, 0, 0, 0, 0],
      });
    });

    // Delete apps
    b.addCase(deleteAppThunk.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (x) => x.apiKey !== action.payload.apiKey
      );
    });

    // Update settings
    b.addCase(updateAppSettingsThunk.fulfilled, (state, action) => {
      const { apiKey, prechat, theme } = action.payload;
      const app = state.items.find((x) => x.apiKey === apiKey);
      if (!app) return;

      if (theme) app.theme = { ...(app.theme || {}), ...theme };
      if (prechat) app.prechat = { ...(app.prechat || {}), ...prechat };
    });
  },
});

export const { setAppRealtimeMeta } = slice.actions;
export default slice.reducer;
