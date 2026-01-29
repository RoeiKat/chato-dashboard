import { http } from "./http";

export const appsApi = {
  create: (token, name) => http("/apps", { method: "POST", token, body: { name } }),
  list: (token) => http("/apps", { method: "GET", token }),
  remove: (token, apiKey) => http(`/apps/${apiKey}`, { method: "DELETE", token }),
  updateSettings: (token, apiKey, { prechat, theme }) =>
    http(`/apps/${apiKey}/settings`, { method: "PATCH", token, body: { prechat, theme } }),
  getConfig: (apiKey) =>
    http("/sdk/config", { method: "GET", apiKey }),
};
