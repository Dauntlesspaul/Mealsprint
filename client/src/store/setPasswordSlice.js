import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const setPassword = createAsyncThunk(
  'password/new',
  async(credentials, {rejectWithValue}) => {
  try{
    const response = await fetch(`${BASE_URL}/set-password`, {
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
  setPassword: STATUS.IDLE
};

const setPasswordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    resetState: (state) => {
      state.setPassword = STATUS.IDLE;
    }
  },
  extraReducers: (builder) =>{
    builder
    .addCase(setPassword.pending, (state) =>{
      state.setPassword = STATUS.LOADING;
    })
    .addCase(setPassword.fulfilled, (state) =>{
      state.setPassword = STATUS.SUCCESS;
    })
    .addCase(setPassword.rejected, (state) =>{
      state.setPassword = STATUS.FAILED;
    })
  }
});

export const {resetState} = setPasswordSlice.actions;
export const getsetPasswordStatus = (state) => state.setpassword.setPassword;
export default setPasswordSlice.reducer;
