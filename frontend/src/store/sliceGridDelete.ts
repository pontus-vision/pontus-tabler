import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface GridDeleteState {
  modelId: string | undefined;
  rowsIds: string[] | undefined;
}

const initialState: GridDeleteState = {
  modelId: undefined,
  rowsIds: undefined,
};

const gridDeleteSlice = createSlice({
  name: 'gridDelete',
  initialState,
  reducers: {
    setEntriesToBeDeleted: (state, action: PayloadAction<GridDeleteState>) => {
      state.modelId = action.payload.modelId;
      state.rowsIds = action.payload.rowsIds;
      console.log(state.rowsIds);
    },
  },
});

export const { setEntriesToBeDeleted } = gridDeleteSlice.actions;

export const selectRowState = (state: RootState) => state.deleteRows;

export default gridDeleteSlice.reducer;
