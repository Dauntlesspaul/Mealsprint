import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    coupon: false,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        addToCart: (state, action) => {
            state.cart = action.payload
        },

        setcoupon: (state, action) =>{
            state.coupon = action.payload;
        },
        removeCoupon: (state, action) => {
            state.coupon = action.payload;
        }
    }
})


export const {addToCart, setcoupon, removeCoupon} = cartSlice.actions;
export const getCartStatus = (state) => state.cart.cart;
export const getCouponStatus = (state) => state.cart.coupon;
export default cartSlice.reducer;
