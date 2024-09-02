import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    picDialogue: false,
}
const pictureSlice = createSlice({
    name: 'picture',
    initialState,
    reducers: {
        setOpen: (state)=> {
            state.picDialogue = true;
        },
        setClose: (state) => {
            state.picDialogue = false;
        }
    }
})

export const {setOpen, setClose} = pictureSlice.actions;
export const getPicDialogueState = (state) => state.picture.picDialogue;
export default pictureSlice.reducer;