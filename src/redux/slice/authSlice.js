import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    manageAuth: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    logOut: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { manageAuth, logOut } = authSlice.actions;

export default authSlice.reducer;
