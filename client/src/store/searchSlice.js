import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";
const initialState = {
    searchInput: '',
    searchResults: [],
    status: STATUS.IDLE, 
    error: null
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchInput: (state, action) => {
            state.searchInput = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.status = STATUS.LOADING
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.status = STATUS.SUCCESS
                state.searchResults = action.payload;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.status = STATUS.FAILED
                state.error = action.error.message;
            });
    }
});

export const fetchSearchResults = createAsyncThunk(
    'search/fetchSearchResults',
    async (query) => {
        const response = await fetch(`${BASE_URL}/search?q=${query}`);
        const data = await response.json();
        return data;
    }
);

export const { setSearchInput } = searchSlice.actions;
export const getInputValue = (state) => state.search.searchInput;
export const getSearchResults = (state) => state.search.searchResults;
export const getSearchStatus = (state) => state.search.status;
export const getSearchError = (state) => state.search.error;

export default searchSlice.reducer;

