import { configureStore } from '@reduxjs/toolkit';
import modelReducer from './slice';
import dashboardsReducer from './sliceDashboards';
import updateRowReducer from './sliceGridUpdate';
import tokenReducer from './sliceToken';

const storedDashboards = localStorage.getItem('dashboards');
const initialState = {
  value: storedDashboards ? JSON.parse(storedDashboards) : [],
};

export const store = configureStore({
  reducer: {
    model: modelReducer,
    dashboards: dashboardsReducer,
    updateRow: updateRowReducer,
    token: tokenReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('dashboards', JSON.stringify(state.dashboards.value));
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
