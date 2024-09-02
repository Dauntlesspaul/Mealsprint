import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiUrl";
import { STATUS } from "../utils/status";

export const fetchMyOrders = createAsyncThunk(
    'order/user',
    async( _ , {rejectWithValue})=>{
        try{
            const response = await fetch(`${BASE_URL}/order-list`, {
                method: 'GET',
                header: {'Content-Type': 'application/json'},
                credentials: "include",
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
    isOrderOn: false,
    orderList: [],
    orderListStatus: STATUS.IDLE,
}

const createOrderSlice = createSlice({
    name: 'oderslice',
    initialState,
    reducers: {
        setOrderOn : (state) =>{
            state.isOrderOn = true;
        },
        setOrderOff: (state) => {
            state.isOrderOn = false
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMyOrders.pending, (state) => {
            state.orderListStatus = STATUS.LOADING
        })
        .addCase(fetchMyOrders.fulfilled, (state, action) => {
            state.orderListStatus = STATUS.SUCCESS;
            state.orderList = action.payload;
        })
        .addCase(fetchMyOrders.rejected, (state) => {
            state.orderListStatus = STATUS.FAILED;
        })
    }
})

export const {setOrderOff, setOrderOn} = createOrderSlice.actions;
export const getOrderStatus = (state) => state.order.isOrderOn;
export const getOrderListStatus = (state) => state.order.orderListStatus;
export const getOrderList = (state) => state.order.orderList;
export default createOrderSlice.reducer;