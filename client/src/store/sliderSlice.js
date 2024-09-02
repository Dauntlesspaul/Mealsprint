import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSidebarOn: false
}

const sideBarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setSidebarOn: (state) => {
            state.isSidebarOn = true;
        },
        setSidebarOff: (state) => {
            state.isSidebarOn = false;
        }
    }
})

export const {setSidebarOn, setSidebarOff} = sideBarSlice.actions;
export const getSideBarStatus = (state) => state.sidebar.isSidebarOn;
export default sideBarSlice.reducer;