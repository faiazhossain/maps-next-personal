import type { TypedUseSelectorHook } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import mapReducer from "./reducers/mapReducer";
import consumerReducer from "./reducers/consumerReducer";

const store = configureStore({
  reducer: {
    map: mapReducer,
    consumer: consumerReducer
  },
});

// Declare Typed Definitions
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
