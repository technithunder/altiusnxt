import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStep: null,
  projectStepsInfo: {
    step1: null,
    step2: null,
    step3: null,
  },
};

const stepsSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    manageStep: (state, action) => {
      state.activeStep = action.payload;
    },
  },
});

export const { manageStep } = stepsSlice.actions;

export default stepsSlice.reducer;
