import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notify: false,
    delete: false,
}


const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        notificationOn: (state) => {
            state.notify = true;
        },
        notificationOff: (state) => {
            state.notify = false;
        },
        deleteItem: (state) => {
            state.delete = true;
        },
        resetDelete: (state) => {
            state.delete = false;
        }
    }
})

export const {notificationOff, notificationOn, resetDelete, deleteItem} = notificationSlice.actions;
export const getNotificationStatus = (state)=> state.notification.notify;
export const getDeleteStatus = (state)=> state.notification.delete;
export default notificationSlice.reducer;