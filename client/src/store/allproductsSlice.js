import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const allProductsFetch = createAsyncThunk(
    'allproducts/fetch', 
    async () => {
        const response = await fetch(`${BASE_URL}/all-products`);
        const data = await response.json();
        return data;
    }
);

const initialState = {
    allProducts: [],
    allProductsStatus: STATUS.IDLE,
};

const allProductsSlice = createSlice({
    name: 'allproducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(allProductsFetch.pending, (state) => {
                state.allProductsStatus = STATUS.LOADING;
            })
            .addCase(allProductsFetch.fulfilled, (state, action) => {
                state.allProducts = action.payload;
                state.allProductsStatus = STATUS.SUCCESS;
            })
            .addCase(allProductsFetch.rejected, (state) => {
                state.allProductsStatus = STATUS.FAILED;
            });
    },
});

export const getAllProducts = (state) => state.allproducts.allProducts;
export const AllProductsStatus = (state) => state.allproducts.allProductsStatus;

export default allProductsSlice.reducer;
