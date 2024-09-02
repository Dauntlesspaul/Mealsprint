import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";


export const verifyCoupon = createAsyncThunk(
    'coupon/verify', 
    async (coupon, {rejectWithValue}) => {
        const response = await fetch(`${BASE_URL}/validate-coupon?code=${coupon}`);
        if(!response.ok){
            const error = await response.json()
            return rejectWithValue(error.message)
        }
        const data = await response.json();
        return data.message;
    }
);

const initialState = {
    message: '',
    couponStatus: STATUS.IDLE,
};

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        reset: (state) =>{
            state.message = '';
            state.couponStatus = STATUS.IDLE;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyCoupon.pending, (state) => {
                state.couponStatus = STATUS.LOADING;
            })
            .addCase(verifyCoupon.fulfilled, (state, action) => {
                state.message = action.payload;
                state.couponStatus = STATUS.SUCCESS;
            })
            .addCase(verifyCoupon.rejected, (state, action) => {
                state.message = action.payload;
                state.couponStatus = STATUS.FAILED;
            });
    },
});

export const {reset} = couponSlice.actions;
export const getMessage = (state) => state.coupon.message;
export const getverifyCouponStatus = (state) => state.coupon.couponStatus;

export default couponSlice.reducer;
