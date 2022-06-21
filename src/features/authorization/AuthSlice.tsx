import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type AuthSlice = boolean;

const initialState: AuthSlice = false;

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setAuth: (state, action) => (
            state = action.payload
        )
    }
})

export const { setAuth } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const authReducer = authSlice.reducer;