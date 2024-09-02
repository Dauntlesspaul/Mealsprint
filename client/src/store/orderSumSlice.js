import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    total: 0
}

const orderSumSlice = createSlice({
    name: 'total',
    initialState,
    reducers:{
        addToTotal: (state, action) => {
            state.total = action.payload
        }
    }
})


export const {addToTotal} = orderSumSlice.actions;
export const getSumTotal = (state) => state.sum.total;
export default orderSumSlice.reducer;
