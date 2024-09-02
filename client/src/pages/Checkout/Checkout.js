import React, { useEffect , useState } from 'react';
import './Checkout.scss';
import bg from '../../assets/images/Background.png';
import icon from '../../assets/images/icon.png';
import Menu from '../../components/svgs/svg.js';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js';
import Sidebar from '../../components/SideBar/Sidebar.js';
import OrderSlide from '../../components/OrderSlide/OrderSlide.js';
import { setOrderOff, setOrderOn } from '../../store/orderSlice.js';
import { getUserDataStatus, fetchUserData } from '../../store/profileSlice.js';
import Loading from '../../components/Loading/Loading.js';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STATUS } from '../../utils/status.js';
import CheckoutForm from './CheckutForm.js';
import { getCartStatus, getCouponStatus} from '../../store/cartSlice.js';
import { getSumTotal } from '../../store/orderSumSlice.js';
import { BASE_URL } from '../../utils/apiUrl.js';
import { useLocalStorage } from '../../hooks/useLocalStorageHook.js';
import { useNavigate } from 'react-router-dom';
import { getDeliveryDetails } from '../../store/deliverySlice.js';

const stripePromise = loadStripe('pk_test_51PVWPWHw3gQYZbvR0DesTddVD6mZR0sllyA5IYIFs3mhWsviN36mH0iFjf7A1FP4L3bHtoc6RmQ8AgakPQ0boGtm00QrkhIhmG');

function Checkout() {
  const dispatch = useDispatch();
  const userStatus = useSelector(getUserDataStatus);
  const [clientSecret, setClientSecret] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const cartItems = useSelector(getCartStatus);
  const total = useSelector(getSumTotal)
  const isCoupon = useSelector(getCouponStatus)
  const [cart, setCart] = useLocalStorage('cart', []);
  const navigate = useNavigate();
  const details = useSelector(getDeliveryDetails)
 

  useEffect(() => {
    dispatch(setSidebarOff());
    dispatch(setOrderOff());
    dispatch(fetchUserData());

  }, [dispatch]);


  useEffect(() => {
    if (!clientSecret) {
      const fetchClientSecret = async () => {
        try {
          const response = await fetch(`${BASE_URL}/create-payment-intent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ total, coupon: isCoupon, cart: cartItems , ...details}),
          });
          const { client_secret, name, email, address } = await response.json();
          setClientSecret(client_secret);
          setName(name);
          setAddress(address);
          setEmail(email);
        } catch (error) {
          console.error('Error fetching client secret:', error);
        }
      };
      fetchClientSecret();
    }
  }, [dispatch, total, details, cartItems, isCoupon, clientSecret])

   useEffect(()=>{
      if(cart.length === 0 || cartItems.length === 0){
        navigate('/menu')
      }
   }, [navigate, cartItems, cart, setCart])

   useEffect(()=>{
    if(!details.email){
      navigate('/order/details')
    }
 }, [navigate, details])


  const options = {
    clientSecret: clientSecret,
    appearance: {/* Customize appearance if needed */}
  };

  if (STATUS.LOADING === userStatus) {
    return <Loading />;
  }


  return (
    <div className='min-h-max bg-[#0D0D0D]'>
      <Sidebar />
      <OrderSlide />
      <div className="relative h-[300px]">
        <img src={bg} alt="" className="w-full h-full object-cover object-bottom" />
        <div className="absolute top-0 left-0 w-full h-full mt-7 px-3 xl:px-40 md:px-10">
          <div onClick={()=>navigate('/')} className='md:hidden grid place-items-center w-full'>
            <img src={icon} alt='' className='h-16 w-auto aspect-auto' />
          </div>
          <div className='md:hidden flex justify-between w-full items-center my-4'>
            <IconButton
              sx={{ marginLeft: '-12px' }}
              onClick={() => { dispatch(setSidebarOn()) }}
            >
              <Menu />
            </IconButton>
            <div onClick={()=>dispatch(setOrderOn())}  className='relative cursor-pointer'>
              <ShoppingCartIcon sx={{ color: 'white', fontSize: '35px' }} />
              <div className='w-3 h-3 rounded-full bg-red-700 text-white flex items-center justify-center absolute top-0 right-0 text-[10px]'>{cartItems.length}</div>
            </div>
          </div>
          <div className='w-full'>
            <h1 className="text-white text-center text-3xl md:text-4xl md:mt-20 leading-[43px] mt-9 font-bold">Checkout</h1>
          </div>
        </div>
      </div>
      <div className='bg-white md:min-h-[650px]  px-3 py-7 md:px-10 2xl:px-40 z-20 md:grid md:place-items-center'>
        <div className='md:flex gap-16 w-full md:space-y-0 space-y-7'>
         <div className=' space-y-1 md:w-[50%]'>
          <h2 className='text-xl font-semibold mb-1 '>Preview</h2>
          {
            cartItems.length > 0 && cartItems.map((item, index) =>(
              <div className='flex shadow-md p-2 items-center justify-between' key={index}>
                <div className='flex gap-2'>
                  <img src={item.image} className='h-16 w-16' alt='' />
                  <span>
                  <h2>{item.name} X {item.units}</h2>
                  <h2 className='text-xs text-[gray]'>{item.description}</h2>
                  </span>
                </div>
                  <h2 className='whitespace-nowrap'>£ {(item.price * item.units).toFixed(2)}</h2>
              </div>
            ))
          }
          
          <div className='flex justify-end'>
        
          </div>
           <div className='w-full flex justify-end'>
          <div className='w-fit text-end'>
            <h2>Subtotal: £ {total.toFixed(2)} </h2>
            <h2>
              Discount:  
              {isCoupon ? (
                <span>£ {((10 / 100) * total).toFixed(2)}</span>
              ) : (
                <span>N/A</span>
              )}
            </h2>
            <h2>Delivery Charge: FREE</h2>
            <hr className='border-none h-[1px] bg-[#e0e0e0] my-[2px]'/>
            <h2>Total: £ {isCoupon ? (total - ((10 / 100) * total)).toFixed(2) : (total).toFixed(2)}</h2>
          </div>
          </div>
         </div>
        <div className="w-full h-fit md:max-w-[500px] shadow-md  md:w-[50%] p-2 md:p-4">
        <h2 className='text-xl font-semibold mb-2 '>Make Payment</h2>
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm  name={name} email={email} address={address}/>
            </Elements>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
