import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { Dashboard } from '../types';
import { IJsonModel } from 'flexlayout-react';

interface dashboardsState {
  value: Dashboard[];
  dashboardId?: string;
}

const initialState: dashboardsState = {
  value: [],
  dashboardId: undefined,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setDashboards: (state, action: PayloadAction<Dashboard>) => {
      state.value = [...state.value, action.payload];
      console.log(state.value);
    },
    updateDashboard: (
      state,
      action: PayloadAction<{ id: string; item: IJsonModel }>,
    ) => {
      state.value = state.value.map((el) => {
        if (el.id === action.payload.id) {
          return {
            ...el,
            gridState: action.payload.item,
          };
        }
        return el;
      });
    },
    deleteDashboard: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.value.findIndex(
        (obj) => obj.id === action.payload.id,
      );
      if (index !== -1) {
        state.value.splice(index, 1);
      }
      console.log({ index });
    },
    setDashboardId: (state, action: PayloadAction<{ id: string }>) => {
      state.dashboardId = action.payload.id;
    },
  },
});

export const {
  setDashboards,
  updateDashboard,
  deleteDashboard,
  setDashboardId,
} = dashboardSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.dashboards.value;

export default dashboardSlice.reducer;
