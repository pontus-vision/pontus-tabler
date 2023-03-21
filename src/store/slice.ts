import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface ModelState {
  modelId: string
}

// Define the initial state using that type
const initialState: ModelState = {
  modelId: "",
}

export const modelSlice = createSlice({
  name: 'modelId',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setModelId: (state, action: PayloadAction<string>) => {
      state.modelId = action.payload
    },
  },
})

export const { setModelId } = modelSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.modelId.value

export default modelSlice.reducer
