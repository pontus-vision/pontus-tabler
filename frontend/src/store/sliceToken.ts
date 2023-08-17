import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { Dashboard } from '../types';
import { IJsonModel } from 'flexlayout-react';

interface tokenState {
  value?: string;
}

const initialState: tokenState = {
  value: undefined,
};

export const tokenSlice = createSlice({
  name: 'token',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      state.value = action.payload.token;
    },
  },
});

export const { setToken } = tokenSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.token.value;

export default tokenSlice.reducer;
