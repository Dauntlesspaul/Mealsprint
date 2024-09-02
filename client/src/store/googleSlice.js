import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl"; 
import { STATUS } from "../utils/status";


export const googleAuth = createAsyncThunk(
    'google/auth',
    async (tokenResponse, { rejectWithValue }) => {
      try {
       
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
  
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user profile data');
        }
  
        const userInfo = await userInfoResponse.json();
  
        
        const userPhoneResponse = await fetch('https://people.googleapis.com/v1/people/me?personFields=phoneNumbers', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
  
        if (!userPhoneResponse.ok) {
          throw new Error('Failed to fetch user phone number');
        }
  
        const userPhone = await userPhoneResponse.json();
  
        
        const userData = {
          profile: userInfo,
          phoneNumber: userPhone.phoneNumbers?.[0]?.value || '',
        };
  
        
        const backendResponse = await fetch(`${BASE_URL}/google-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
          credentials: 'include',
        });
  
        if (!backendResponse.ok) {
          throw new Error('Failed to send data to the backend');
        }
  
        const backendData = await backendResponse.json();
        return backendData;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );


const initialState = {
    loginStatus: STATUS.IDLE,
    error: null,
};


const authGoogleSlice = createSlice({
    name: 'google',
    initialState,
    reducers: {
        resetGoogleAuth: (state) => {
            state.loginStatus = STATUS.IDLE;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(googleAuth.pending, (state) => {
            state.loginStatus = STATUS.IDLE;
        })
        .addCase(googleAuth.fulfilled, (state, action) => {
            state.loginStatus = STATUS.SUCCESS;
        })
        .addCase(googleAuth.rejected, (state, action) => {
            state.loginStatus = STATUS.FAILED;
            state.error = action.payload; 
        });
    }
});

export const {resetGoogleAuth} = authGoogleSlice.actions;
export const getAuthStatus = (state) => state.google.loginStatus;
export const getAuthError = (state) => state.google.error;

export default authGoogleSlice.reducer;
