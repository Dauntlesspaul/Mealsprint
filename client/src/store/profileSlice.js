import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../utils/status";
import { BASE_URL } from "../utils/apiUrl";

export const fetchUserData = createAsyncThunk(
    'user/data',
    async(_, {rejectWithValue})=>{
        try{
            const response = await fetch(`${BASE_URL}/user-profile`, {
                credentials: 'include',
            })

            if(!response.ok){
                const error = await response.json();
                return rejectWithValue(error.message)
            }

            const data = await response.json();
            return data;
        }catch(error){
            return rejectWithValue(error.message)
        }
    }
)

const initialState = {
    userData: {},
    userDataStatus: STATUS.IDLE,
    loggedIn: false,
}

 const profileSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetLoggedIn: (state)=>{
            state.loggedIn = false;
            state.userData = {};
            state.userDataStatus = STATUS.IDLE;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserData.pending, (state) =>{
            state.userDataStatus = STATUS.LOADING;
            state.loggedIn = false;
        })
        .addCase(fetchUserData.fulfilled, (state, action) =>{
            state.userData = action.payload;
            state.userDataStatus = STATUS.SUCCESS;
            state.loggedIn = true;
        })
        .addCase(fetchUserData.rejected, (state, action)=>{
            state.userDataStatus = STATUS.FAILED;
            state.loggedIn = false;
            state.error = action.payload || 'Failed to fetch user data';
        })
    }
})
export const {resetLoggedIn} = profileSlice.actions;
export const getUserData = (state) => state.user.userData;
export const getUserDataStatus = (state) => state.user.userDataStatus;
export const getUserLogInStatus = (state) => state.user.loggedIn;
export default profileSlice.reducer;