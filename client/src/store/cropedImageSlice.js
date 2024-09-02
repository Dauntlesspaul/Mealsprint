import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import {STATUS} from '../utils/status'

export const uploadImage = createAsyncThunk(
    'image/profile', 
    async(credentials, {rejectWithValue}) =>{
        try{
            const response = await fetch(`${BASE_URL}/profile-upload`, {
                method: 'POST',
                body: credentials,
                credentials: 'include',
            })
            if(!response.ok){
                const error = await response.json();
                return rejectWithValue(error.message)
            }

            const data = await response.json()
            return data;
        }catch(error){
          return rejectWithValue(error.message)
        }
    }
)

const initialState = {
    image: null,
    cropperOn: false,
    imageStatus : STATUS.IDLE,
}
const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        setImage: (state,action)=> {
            state.image = action.payload;
            state.cropperOn = true;
        },
        resetImage: (state) => {
            state.image = null;
            state.cropperOn = false;
        }
    },
    extraReducers: (builder) => {
            builder
            .addCase(uploadImage.pending, (state) => {
                state.imageStatus = STATUS.LOADING;
            })
            .addCase(uploadImage.fulfilled, (state) => {
                state.imageStatus = STATUS.SUCCESS;
            })
            .addCase(uploadImage.rejected, (state) => {
                state.imageStatus = STATUS.FAILED;
            })
    }
})

export const {setImage, resetImage} = imageSlice.actions;
export const getImageData = (state) => state.image.image;
export const getCropperStatus = (state) => state.image.cropperOn
export default imageSlice.reducer;