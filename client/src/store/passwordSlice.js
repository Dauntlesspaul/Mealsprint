import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const passwordCheck = createAsyncThunk(
    'password/check',
    async(_, {rejectWithValue}) => {
        try{
            const response = await fetch(`${BASE_URL}/password-check`,{
                headers:{
                   'Content-Type':'application/json'
                },
                credentials: 'include'
            })
            if(!response.ok){
                const error = await response.json();
                return rejectWithValue(error.message)
            }
            const data = await response.json();
            return data.message;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

const initialState = {
    password: false,
    passwordCheckStatus: STATUS.IDLE,
    error:'',
}

const passwordSlice = createSlice({
    name: 'password',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(passwordCheck.pending, (state) => {
            state.passwordCheckStatus = STATUS.IDLE
        })
        .addCase(passwordCheck.fulfilled, (state, action) => {
            state.password = action.payload;
            state.passwordCheckStatus = STATUS.SUCCESS;
        })
        .addCase(passwordCheck.rejected, (state, action)=>{
            state.passwordCheckStatus = STATUS.FAILED;
            state.error = action.payload;
        })

    }
})


export const getPasswordStatus = (state) => state.passwordcheck.password;
export const getPasswordCheckStatus = (state) => state.passwordcheck.passwordCheckStatus;
export const getErrorMessage = (state) => state.passwordcheck.error;
export default passwordSlice.reducer;
