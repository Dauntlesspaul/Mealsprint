import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const deleteAddress = createAsyncThunk(
  'address/delete',
  async(addressId, {rejectWithValue}) => {
  try{
    const response = await fetch(`${BASE_URL}/delete-address?addressId=${addressId}`, {
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
  deleteStatus: STATUS.IDLE
};

const deleteAddressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) =>{
    builder
    .addCase(deleteAddress.pending, (state) =>{
      state.deleteStatus = STATUS.LOADING;
    })
    .addCase(deleteAddress.fulfilled, (state) =>{
      state.deleteStatus = STATUS.SUCCESS;
    })
    .addCase(deleteAddress.rejected, (state) =>{
      state.deleteStatus = STATUS.FAILED;
    })
  }
});


export const getDeleteStatus = (state) => state.delete.deleteStatus;
export default deleteAddressSlice.reducer;
