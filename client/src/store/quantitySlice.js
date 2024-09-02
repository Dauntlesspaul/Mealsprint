import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 1
}

const quantitySlice = createSlice({
    name: 'quantity',
    initialState,
    reducers: {
        increment: (state)=> {
         state.count += 1
        },
        decrement: (state) => {
            if(state.count > 1){
                state.count -= 1
            }
        },
        reset: (state) => {
            state.count = 1
        }
    },

})

export const {increment, decrement, reset} = quantitySlice.actions
export const getCount = (status) => status.quantity.count;
export  default quantitySlice.reducer;