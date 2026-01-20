import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "../api/dashboardApi";

function startOfWeekMs(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Sunday = 0
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
}

export const loadWeekShiftsThunk = createAsyncThunk(
  "dashboard/loadWeekShifts",
  async ({ token, weekStartMs }) => {
    const { shifts, weekStart } = await dashboardApi.listShifts(token, weekStartMs);
    return { shifts, weekStart };
  }
);

export const createShiftThunk = createAsyncThunk(
  "dashboard/createShift",
  async ({ token, startedAt, endedAt, durationMs }, { dispatch, getState }) => {
    await dashboardApi.createShift(token, { startedAt, endedAt, durationMs });

    // refresh current week after saving
    const ws = getState().dashboard.weekStartMs;
    await dispatch(loadWeekShiftsThunk({ token, weekStartMs: ws }));
    return true;
  }
);

export const loadRemindersThunk = createAsyncThunk(
  "dashboard/loadReminders",
  async ({ token }) => {
    const { reminders } = await dashboardApi.listReminders(token);
    return { reminders };
  }
);

export const createReminderThunk = createAsyncThunk(
  "dashboard/createReminder",
  async ({ token, text }, { dispatch }) => {
    await dashboardApi.createReminder(token, text);
    await dispatch(loadRemindersThunk({ token }));
    return true;
  }
);

export const deleteReminderThunk = createAsyncThunk(
  "dashboard/deleteReminder",
  async ({ token, id }, { dispatch }) => {
    await dashboardApi.deleteReminder(token, id);
    await dispatch(loadRemindersThunk({ token }));
    return true;
  }
);

const slice = createSlice({
  name: "dashboard",
  initialState: {
    weekStartMs: startOfWeekMs(),
    shifts: [],
    reminders: [],
    loadingShifts: false,
    loadingReminders: false,
  },
  reducers: {
    setWeekStartMs(state, action) {
      state.weekStartMs = Number(action.payload) || state.weekStartMs;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadWeekShiftsThunk.pending, (s) => {
      s.loadingShifts = true;
    });
    b.addCase(loadWeekShiftsThunk.fulfilled, (s, a) => {
      s.loadingShifts = false;
      s.weekStartMs = a.payload.weekStart;
      s.shifts = a.payload.shifts || [];
    });
    b.addCase(loadWeekShiftsThunk.rejected, (s) => {
      s.loadingShifts = false;
    });

    b.addCase(loadRemindersThunk.pending, (s) => {
      s.loadingReminders = true;
    });
    b.addCase(loadRemindersThunk.fulfilled, (s, a) => {
      s.loadingReminders = false;
      s.reminders = a.payload.reminders || [];
    });
    b.addCase(loadRemindersThunk.rejected, (s) => {
      s.loadingReminders = false;
    });
  },
});

export const { setWeekStartMs } = slice.actions;
export default slice.reducer;
