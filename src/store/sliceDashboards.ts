import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Dashboard } from "../types";

interface dashboardsState {
  value: Dashboard[];
}

const initialState: dashboardsState = {
  value: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setDashboards: (state, action: PayloadAction<Dashboard>) => {
      state.value = [...state.value, action.payload];
      console.log(state.value);
    },
  },
});

export const { setDashboards } = dashboardSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.dashboards.value;

export default dashboardSlice.reducer;
