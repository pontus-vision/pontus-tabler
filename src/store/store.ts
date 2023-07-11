import { configureStore } from '@reduxjs/toolkit';
import modelReducer from './slice';
import dashboardsReducer from './sliceDashboards';
import updateRowReducer from './sliceGridUpdate';

const storedDashboards = localStorage.getItem('dashboards');
const initialState = {
  value: storedDashboards ? JSON.parse(storedDashboards) : [],
};

export const store = configureStore({
  reducer: {
    model: modelReducer,
    dashboards: dashboardsReducer,
    updateRow: updateRowReducer,
  },
  preloadedState: initialState,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
