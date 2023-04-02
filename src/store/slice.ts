import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface ModelState {
  model: Object;
  models: any[]
}

// Define the initial state using that type
const initialState: ModelState = {
  model: {},
  models: []
}

export const modelSlice = createSlice({
  name: 'model',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setModel: (state, action: PayloadAction<Object>) => {
      state.model = action.payload
    },
    // setModels: (state , action: PayloadAction<any[]>) => {
    //   state.models = action.payload
    // }
    
  },
})

export const { setModel } = modelSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.model.value

export default modelSlice.reducer
