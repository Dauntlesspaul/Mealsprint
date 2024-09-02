import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    details: {}
}

const deliverySlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        setDetails: (state, action) => {
            state.details = action.payload
        }
    }
})


export const {setDetails} = deliverySlice.actions;
export const getDeliveryDetails = (state) => state.delivery.details;
export default deliverySlice.reducer;
