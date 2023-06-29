import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface GridUpdateState {
  modelId: string | undefined;
  rowId: string | undefined;
  rowState: { [key: string]: { [key: string]: unknown } };
}

const initialState: GridUpdateState = {
  modelId: undefined,
  rowId: undefined,
  rowState: {},
};

const gridUpdateSlice = createSlice({
  name: 'gridUpdate',
  initialState,
  reducers: {
    newRowState: (state, action: PayloadAction<GridUpdateState>) => {
      state.modelId = action.payload.modelId;
      state.rowId = action.payload.rowId;
      state.rowState = action.payload.rowState;
    },
  },
});

export const { newRowState } = gridUpdateSlice.actions;

export const selectRowState = (state: RootState) => state.gridUpdate.rowState;

export default gridUpdateSlice.reducer;
