import { configureStore } from "@reduxjs/toolkit"

import chatReducer from "./reducers/chat"
import userReducer from "./reducers/user"

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
