import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

const initialState = {
    categories: [],
    categoryStatus: STATUS.IDLE,
    categoryProducts: [],
    categoryProductsStatus: STATUS.IDLE
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
    },
    extraReducers: (builder)=>{
        builder
        .addCase(createFetchAsync.pending, (state, action)=>{
            state.categoryProductsStatus = STATUS.LOADING
        })
        .addCase(createFetchAsync.fulfilled, (state, action)=>{
            state.categories = action.payload;
            state.categoryProductsStatus = STATUS.SUCCESS
        })
        .addCase(createFetchAsync.rejected, (state, action) => {
            state.categoryProductsStatus = STATUS.FAILED
        })
    }
})

export const createFetchAsync = createAsyncThunk(
    'category/fetch', async()=>{
        const response = await fetch(`${BASE_URL}recipes`)
        const data = await response.json()
        return data;
    }
)

export const getAllCategories = (status) => status.category.categories;
export  default categorySlice.reducer;