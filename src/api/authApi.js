import { http } from "./http";

export const authApi = {
  register: (email, password) => http("/auth/register", { method: "POST", body: { email, password } }),
  login: (email, password) => http("/auth/login", { method: "POST", body: { email, password } }),
};
