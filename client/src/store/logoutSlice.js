import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const userLogout = createAsyncThunk(
  'login/user-logout',
  async(_, {rejectWithValue}) => {
  try{
    const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    if(!response.ok){
      const error = await response.json()
      return rejectWithValue(error.message);
    }

    const data = await response.json()
    return data;

  }catch(error){
    return rejectWithValue(error.message);
  }
  }
)

const initialState = {
  logout: false,
  logoutStatus: STATUS.IDLE

};

const logoutSlice = createSlice({
    name: 'logout',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(userLogout.pending, (state) => {
          state.logoutStatus = STATUS.LOADING;
          state.logout = false;
        })
        .addCase(userLogout.fulfilled, (state) => {
          state.logout = true;
          state.logoutStatus = STATUS.SUCCESS;
        })
        .addCase(userLogout.rejected, (state) => {
          state.logout = false;
          state.logoutStatus = STATUS.FAILED;
        });
    },
  });

export const getLogout = (state) => state.logout.logout;
export const getLogoutStatus = (state) => state.logout.logoutStatus;
export default logoutSlice.reducer;
