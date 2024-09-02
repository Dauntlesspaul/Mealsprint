import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const userSignUp = createAsyncThunk(
  'signup/createAccount',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  initialInput: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  signupStatus: STATUS.IDLE,
  userData: null, 
  error: null, 
};

const signupInputSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setChange: (state, action) => {
      const { name, value } = action.payload;
      state.initialInput[name] = value;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignUp.pending, (state) => {
        state.signupStatus = STATUS.LOADING;
        state.error = null; 
      })
      .addCase(userSignUp.fulfilled, (state, action) => {
        state.signupStatus = STATUS.SUCCESS;
        state.userData = action.payload; 
      })
      .addCase(userSignUp.rejected, (state, action) => {
        state.signupStatus = STATUS.FAILED;
        state.error = action.payload; 
      });
  }
});

export const { setChange } = signupInputSlice.actions;
export const getSignupInput = (state) => state.signup.initialInput;
export const getSignupStatus = (state) => state.signup.signupStatus;
export const getSignupData = (state) => state.signup.userData;
export const getSignupError = (state) => state.signup.error; 
export default signupInputSlice.reducer;
