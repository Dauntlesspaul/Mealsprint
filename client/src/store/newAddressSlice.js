import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const addressEdit = createAsyncThunk(
  'address/edit',
  async(credentials, {rejectWithValue}) => {
  try{
    const response = await fetch(`${BASE_URL}/newaddress`, {
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
  editStatus: STATUS.IDLE
};

const addressEditSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) =>{
    builder
    .addCase(addressEdit.pending, (state) =>{
      state.editStatus = STATUS.LOADING;
    })
    .addCase(addressEdit.fulfilled, (state) =>{
      state.editStatus = STATUS.SUCCESS;
    })
    .addCase(addressEdit.rejected, (state) =>{
      state.editStatus = STATUS.FAILED;

    })
  }
});


export const getEditStaus = (state) => state.newaddress.editStatus;
export default addressEditSlice.reducer;
