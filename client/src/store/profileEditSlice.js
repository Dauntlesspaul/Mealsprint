import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const profileEdit = createAsyncThunk(
  'profile/edit',
  async(credentials, {rejectWithValue}) => {
  try{
    const response = await fetch(`${BASE_URL}/edit-profile`, {
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
  loginStatus: STATUS.IDLE
};

const profileEditSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) =>{
    builder
    .addCase(profileEdit.pending, (state) =>{
      state.loginStatus = STATUS.LOADING;
    })
    .addCase(profileEdit.fulfilled, (state) =>{
      state.loginStatus = STATUS.SUCCESS;
    })
    .addCase(profileEdit.rejected, (state) =>{
      state.loginStatus = STATUS.FAILED;

    })
  }
});


export const getEditStaus = (state) => state.edit.loginStatus;
export default profileEditSlice.reducer;
