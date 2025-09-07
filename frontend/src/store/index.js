import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./slice/allSlicer"

export const store = configureStore({
    reducer : {
        allSlicer : userSliceReducer,
    }
})