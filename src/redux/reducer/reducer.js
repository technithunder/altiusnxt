import { combineReducers } from "@reduxjs/toolkit";

//relative path imports
import authSlice from "../slice/authSlice";
import stepsSlice from "../slice/stepSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  steps: stepsSlice,
});

export default rootReducer;
