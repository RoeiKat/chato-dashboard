import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

const TOKEN_KEY = "chato_jwt";

export const registerThunk = createAsyncThunk("auth/register", async ({ email, password }) => {
  const { token } = await authApi.register(email, password);
  return token;
});

export const loginThunk = createAsyncThunk("auth/login", async ({ email, password }) => {
  const { token } = await authApi.login(email, password);
  return token;
});

const slice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem(TOKEN_KEY) || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (b) => {
    b.addCase(registerThunk.pending, (s) => { s.status = "loading"; s.error = null; })
     .addCase(registerThunk.fulfilled, (s, a) => {
       s.status = "succeeded"; s.token = a.payload; localStorage.setItem(TOKEN_KEY, a.payload);
     })
     .addCase(registerThunk.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })

     .addCase(loginThunk.pending, (s) => { s.status = "loading"; s.error = null; })
     .addCase(loginThunk.fulfilled, (s, a) => {
       s.status = "succeeded"; s.token = a.payload; localStorage.setItem(TOKEN_KEY, a.payload);
     })
     .addCase(loginThunk.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; });
  }
});

export const { logout } = slice.actions;
export default slice.reducer;
