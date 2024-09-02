import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {STATUS} from '../utils/status';
import {BASE_URL} from '../utils/apiUrl';


export const subscribeNewsletter = createAsyncThunk(
    'news/letter',
    async(credentials, {rejectWithValue})=>{
        try{
         const response = await fetch (`${BASE_URL}/news-letter`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
         })

         if(!response.ok){
            const error = await response.json();
            return rejectWithValue(error.message)
         }

         const data = await response.json();
         return data;
        }catch(error){
        return rejectWithValue(error.message)
        }
    }
)


const initialState = {
    status: STATUS.IDLE,
}
const newsletterSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        reset: (state) =>{
            state.status = STATUS.IDLE;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(subscribeNewsletter.pending, (state) => {
            state.status = STATUS.LOADING;
        })
        .addCase(subscribeNewsletter.fulfilled, (state) => {
            state.status = STATUS.SUCCESS;
        })
        .addCase(subscribeNewsletter.rejected, (state) => {
            state.status = STATUS.FAILED;
        })
    }
})
export const {reset} = newsletterSlice.actions;
export const getLetterStatus = (state) => state.letter.status;
export default newsletterSlice.reducer;