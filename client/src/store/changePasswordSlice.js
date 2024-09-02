import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const changePassword = createAsyncThunk(
  'password/new',
  async(credentials, {rejectWithValue}) => {
  try{
    const response = await fetch(`${BASE_URL}/change-password`, {
      method: 'POST',
      body:JSON.stringify(credentials),
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
  changePassword: STATUS.IDLE
};

const changePasswordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    resetState: (state) => {
      state.changePassword = STATUS.IDLE;
    }
  },
  extraReducers: (builder) =>{
    builder
    .addCase(changePassword.pending, (state) =>{
      state.changePassword = STATUS.LOADING;
    })
    .addCase(changePassword.fulfilled, (state) =>{
      state.changePassword = STATUS.SUCCESS;
    })
    .addCase(changePassword.rejected, (state) =>{
      state.changePassword = STATUS.FAILED;
    })
  }
});

export const {resetState} = changePasswordSlice.actions;
export const getchangePasswordStatus = (state) => state.password.changePassword;
export default changePasswordSlice.reducer;
