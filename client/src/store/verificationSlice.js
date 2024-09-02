import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../utils/status";
import { BASE_URL } from "../utils/apiUrl";


export const verifyUser = createAsyncThunk(
  'verify/user',
  async ({code, email}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/verify-user?code=${code}&email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue({message: error.message, status: error.status});
      }

      const data = await response.json();
      return data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  verified: null,
  message: '',
  verificationStatus: STATUS.IDLE,
};

const verificationSlice = createSlice({
  name: 'verify',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyUser.pending, (state) => {
        state.verificationStatus = STATUS.LOADING;
        state.message = ''; 
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.verified = action.payload.status;
        state.verificationStatus = STATUS.SUCCESS;
        state.message = ''; 
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.message = action.payload.message || 'An error occurred'; 
        state.verified = action.payload.status;
        state.verificationStatus = STATUS.FAILED;
      });
  },
});


export const getVerificationStatus = (state) => state.verify.verified;
export const getVerificationMessage = (state) => state.verify.message;
export const getVerifyingStatus = (state) => state.verify.verificationStatus;
export default verificationSlice.reducer;
