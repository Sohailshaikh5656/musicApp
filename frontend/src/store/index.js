import { configureStore } from "@reduxjs/toolkit";
import adminSlicerReducer from "./slice/allSlicer"
import userSlicerReducer from "./slice/userSlicer"

export const store = configureStore({
    reducer : {
        allSlicer : adminSlicerReducer,
        userAllSlicer : userSlicerReducer
    }
})