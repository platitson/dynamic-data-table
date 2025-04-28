import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import itemsReducer from "./itemsSlice";

enableMapSet();

export const store = configureStore({
  reducer: {
    items: itemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
