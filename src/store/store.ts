import { configureStore } from "@reduxjs/toolkit";
import modelReducer from "./slice";
import dashboardsReducer from "./sliceDashboards";

export const store = configureStore({
  reducer: {
    model: modelReducer,
    dashboards: dashboardsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
