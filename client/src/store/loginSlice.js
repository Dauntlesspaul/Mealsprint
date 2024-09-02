import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const userLogin = createAsyncThunk(
  'login/user-login',
  async(credentials, {rejectWithValue}) => {
  try{
    const response = await fetch(`${BASE_URL}/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
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
  initialInput: {
    email: '',
    password: ''
  },
  accessed: false,
  loginMessage: '',
  loginStatus: STATUS.IDLE

};

const loginInputSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setChange: (state, action) => {
      const { name, value } = action.payload;
      state.initialInput[name] = value;
    },
    logout: (state) => {
      state.accessed = false;
      state.initialInput = { email: '', password: '' };
      state.loginMessage = '';
      state.loginStatus = STATUS.IDLE;
    },
    resetLoginStatus: (state) => {
      state.loginStatus = STATUS.IDLE;
    },
  },
  extraReducers: (builder) =>{
    builder
    .addCase(userLogin.pending, (state) =>{
      state.accessed = false;
      state.loginStatus = STATUS.LOADING;
      state.loginMessage = '';
    })
    .addCase(userLogin.fulfilled, (state) =>{
      state.accessed = true;
      state.loginMessage = '';
      state.loginStatus = STATUS.SUCCESS;
    })
    .addCase(userLogin.rejected, (state,action) =>{
      state.accessed = false;
      state.loginMessage = action.payload.message;
      state.loginStatus = STATUS.FAILED;

    })
  }
});

export const { setChange, logout, resetLoginStatus } = loginInputSlice.actions;
export const getLoginInput = (state) => state.login.initialInput;
export const getLoginStaus = (state) => state.login.loginStatus;
export const getAccessStatus = (state) => state.login.accessed;
export default loginInputSlice.reducer;
