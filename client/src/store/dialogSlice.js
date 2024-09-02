import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isDialogOpen: false,
    content: {}
}

const dialogSlice= createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        setDialogOpen: (state, action)=>{
            state.isDialogOpen = true;
            state.content = action.payload
        },
        setDialogClose: (state) => {
            state.isDialogOpen = false;
            state.content = {}
        }
    },
})

export const {setDialogClose, setDialogOpen} = dialogSlice.actions;
export const getDialogStatus = (state) => state.dialog.isDialogOpen;
export const getContentStatus = (state) => state.dialog.content;
export  default dialogSlice.reducer;