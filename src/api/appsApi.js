import { http } from "./http";

export const appsApi = {
  create: (token, name) => http("/apps", { method: "POST", token, body: { name } }),
  list: (token) => http("/apps", { method: "GET", token }),
  remove: (token, apiKey) => http(`/apps/${apiKey}`, { method: "DELETE", token }),

  // NEW: owner updates app settings
  updateSettings: (token, apiKey, { prechat, theme }) =>
    http(`/apps/${apiKey}/settings`, { method: "PATCH", token, body: { prechat, theme } }),

  // NEW: fetch settings via SDK config (since you don't have GET /apps/:apiKey/settings)
  // sdk/config uses authApiKey middleware on server, so we pass the apiKey header (same way the SDK does).
  getConfig: (apiKey) =>
    http("/sdk/config", { method: "GET", apiKey }),
};
