import { http } from "./http";

export const appsApi = {
  create: (token, name) => http("/apps", { method: "POST", token, body: { name } }),
  list: (token) => http("/apps", { method: "GET", token }),
  remove: (token, apiKey) => http(`/apps/${apiKey}`, { method: "DELETE", token }),
};
