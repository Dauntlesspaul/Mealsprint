import React, { useEffect } from 'react';
import './Orders.scss';
import bg from '../../assets/images/Background.png';
import icon from '../../assets/images/icon.png';
import Menu from '../../components/svgs/svg.js';
import { IconButton, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js';
import Sidebar from '../../components/SideBar/Sidebar.js';
import { Link, useNavigate } from 'react-router-dom';
import OrderSlide from '../../components/OrderSlide/OrderSlide.js';
import { fetchMyOrders, getOrderList, getOrderListStatus, setOrderOff, setOrderOn } from '../../store/orderSlice.js';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { STATUS } from '../../utils/status.js';
import Loading from '../../components/Loading/Loading.js';
import { formatDate } from '../../utils/Time.js';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import { getCartStatus } from '../../store/cartSlice.js';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AlertDialogSlide from '../../components/Dialog/Logout.js';

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setSidebarOff());
    dispatch(setOrderOff());
    dispatch(fetchMyOrders());
  }, [dispatch]);


  const orderList = useSelector(getOrderList);
  const status = useSelector(getOrderListStatus);
  const cartItems = useSelector(getCartStatus);


  useEffect(()=>{
    if(status === STATUS.FAILED){
     navigate('/login')
    }
   }, [status])
   

  if (STATUS.LOADING === status) {
    return <Loading />;
  }

  return (
    <div className="min-h-max bg-[white]">
      <Sidebar />
      <OrderSlide />
      <div className="relative h-[300px]">
        <img src={bg} alt="" className="w-full h-full object-cover object-bottom" />
        <div className="absolute top-0 left-0 w-full h-full mt-7 px-4 xl:px-40 md:px-30">
          <div onClick={()=>navigate('/')} className="md:hidden grid place-items-center w-full">
            <img src={icon} alt="" className="h-16 w-auto aspect-auto" />
          </div>
          <div className="md:hidden flex justify-between w-full items-center my-4">
            <IconButton sx={{ marginLeft: '-12px' }} onClick={() => { dispatch(setSidebarOn()); }}>
              <Menu />
            </IconButton>
            <div onClick={() => dispatch(setOrderOn())} className="relative cursor-pointer">
              <ShoppingCartIcon sx={{ color: 'white', fontSize: '35px' }} />
              <div className="w-3 h-3 rounded-full bg-red-700 text-white flex items-center justify-center absolute top-0 right-0 text-[10px]">{cartItems.length}</div>
            </div>
          </div>
          <div className="w-full">
            <h1 className="text-white text-center md:text-center text-3xl md:text-4xl md:mt-20 leading-[43px] mt-9 font-bold">My Profile</h1>
          </div>
        </div>
      </div>
      <div className="px-3 md:px-10 xl:px-24 2xl:px-40 md:flex md:gap-8 py-5">
        <div className="border divide-y-[1px] md:w-[30%] h-fit">
          <Link to="/user" className="block">
            <div className="w-full flex justify-between px-3 items-center h-12">
              <span>My Account</span> <ArrowRightIcon sx={{ color: 'orange' }} />
            </div>
          </Link>
          <Link to="/user/address" className="block">
            <div className="w-full flex justify-between px-3 items-center h-12">
              <span>Address</span> <ArrowRightIcon sx={{ color: 'orange' }} />
            </div>
          </Link>
          <div className="w-full text-white bg-[orange] flex justify-between px-3 items-center h-12">
            <span>My Orders</span> <ArrowRightIcon sx={{ color: 'white' }} />
          </div>
          <AlertDialogSlide/>
        </div>

        <div className="shadow-md h-fit mt-5 md:mt-0 px-3 md:flex-1 border-[1px] border-[#e0e0e0] rounded-sm py-3 md:py-0">
          <h2 className="md:mt-5 my-3 font-medium"><LocalMallOutlinedIcon sx={{ marginTop: '-3px' }} /> My Orders</h2>
          <hr className="my-2" />
          <div className="space-y-10 mb-3">
            {orderList.length === 0 ? (
              <>
                <h2>You haven't placed any orders yet.</h2>
                <p>Explore our menu and start ordering your favorite items today!</p>
                <Button variant="contained" color="primary" onClick={() => navigate('/menu')}>
                  Browse Menu
                </Button>
              </>
            ) : (
              orderList.map((items, index) => (
                <div key={index} className='shadow-md p-3 rounded-sm'>
                  <div className="flex gap-2 items-center">
                    <h2>Order ID: {items.orderId}</h2>
                    <span className="bg-[green] text-sm text-white p-1">{items.paymentStatus}</span>
                  </div>
                  <p>Customer Name: {items.customerDetails.name}</p>
                  <p>Email: {items.email}</p>
                  <p>Delivery Status: <span className="text-red-600">{items.deliveryStatus}</span></p>
                  <div className="space-y-4">
                    {items.cart.map((item, idx) => (
                      <div key={idx} className="flex gap-2 shadow-md p-2">
                        <img className="w-12 h-12" src={item.image} alt="" />
                        <div className="flex justify-between w-full items-center">
                          <div>
                            <span className="block">{item.name} X{item.units}</span>
                            <span className="text-xs text-[gray] block">{item.description}</span>
                          </div>
                          <div>£{item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="md:flex md:justify-between my-4">
                    <div>
                      <p><NearMeOutlinedIcon sx={{ marginTop: '-3px', fontSize: '18px' }} /> {items.customerDetails.address.line1}</p>
                      <p><LocalPhoneOutlinedIcon sx={{ marginTop: '-3px', fontSize: '18px' }} /> {items.customerDetails.phone}</p>
                      <p><WatchLaterOutlinedIcon sx={{ marginTop: '-3px', fontSize: '18px' }} /> {formatDate(items.createdAt)}</p>
                    </div>
                    <div className="text-end">
                      <p>Subtotal: £{items.amountSubtotal.toFixed(2)}</p>
                      <p>Discount: {items.discount === 0 ? 'N/A' : `£${items.discount.toFixed(2)}`}</p>
                      {items.discount !== 0 && <p>Coupon Code: MS1710</p>}
                      <p>Delivery: Free</p>
                      <p>Total: £{items.amountTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
