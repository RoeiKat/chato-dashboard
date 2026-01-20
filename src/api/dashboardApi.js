import { http } from "./http";

export const dashboardApi = {
  // shifts
  createShift: (token, payload) =>
    http("/dashboard/shifts", { method: "POST", token, body: payload }),

  listShifts: (token, weekStartMs) =>
    http(`/dashboard/shifts?weekStart=${encodeURIComponent(weekStartMs)}`, { method: "GET", token }),

  // reminders
  listReminders: (token) => http("/dashboard/reminders", { method: "GET", token }),
  createReminder: (token, text) =>
    http("/dashboard/reminders", { method: "POST", token, body: { text } }),
  deleteReminder: (token, id) =>
    http(`/dashboard/reminders/${id}`, { method: "DELETE", token }),
};
