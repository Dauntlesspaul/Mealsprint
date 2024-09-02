import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";


export const introProductsFetch = createAsyncThunk(
    'products/intro/fetch', 
    async (category) => {
        const response = await fetch(`${BASE_URL}/intro-products?category=${category}`);
        const data = await response.json();
        return data;
    }
);

const initialState = {
    introProducts: [],
    introProductsStatus: STATUS.IDLE,
};

const introProductsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(introProductsFetch.pending, (state) => {
                state.introProductsStatus = STATUS.LOADING;
            })
            .addCase(introProductsFetch.fulfilled, (state, action) => {
                state.introProducts = action.payload;
                state.introProductsStatus = STATUS.SUCCESS;
            })
            .addCase(introProductsFetch.rejected, (state) => {
                state.introProductsStatus = STATUS.FAILED;
            });
    },
});


export const getIntroProducts = (state) => state.products.introProducts;
export const getIntroProductsFetchStatus = (state) => state.products.introProductsStatus;

export default introProductsSlice.reducer;
