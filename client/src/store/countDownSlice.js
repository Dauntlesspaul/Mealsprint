import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    timeLeft: 120
}

const countDownSlice = createSlice({
    name: 'countdown',
    initialState,
    reducers: {
        setCountDown: (state) => {
            state.timeLeft -= 1
        },
        resetCountDown: (state) =>{
            state.timeLeft = 120
        }
    }
})

export const {setCountDown, resetCountDown} = countDownSlice.actions;
export const getTimeLeft = (state) => state.countdown.timeLeft
export default countDownSlice.reducer