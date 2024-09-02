import React, { useEffect, useRef, useState } from 'react'
import './OrderSlide.scss'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, getCartStatus, getCouponStatus, removeCoupon, setcoupon } from '../../store/cartSlice'
import { useLocalStorage } from '../../hooks/useLocalStorageHook'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {STATUS} from '../../utils/status';
import Tooltip from '@mui/material/Tooltip';
import { getOrderStatus, setOrderOff } from '../../store/orderSlice'
import { EmptyCart } from '../svgs/svg'
import { CircularProgress, IconButton } from '@mui/material'
import { addToTotal, getSumTotal } from '../../store/orderSumSlice'
import { useNavigate } from 'react-router-dom'
import CustomizedSnackbars from '../snackBar/SnackBar'
import { getMessage, getverifyCouponStatus, reset } from '../../store/couponSlice';
import  {verifyCoupon } from '../../store/couponSlice.js';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { deleteItem, getDeleteStatus, resetDelete } from '../../store/notificationSlice.js';
import DeleteFromCartSound from '../../assets/audio/remove.mp3';
import ErrorSound from '../../assets/audio/error.mp3';
import CouponSound from '../../assets/audio/coupon.mp3';
import useSound from '../../hooks/useSoundHook.js';


function OrderSlide() {
    const cartItems = useSelector(getCartStatus)
    const [cart, setCart] = useLocalStorage('cart', [])
    const [couponCode, setCouponCode] = useLocalStorage('coupon', false)
    const dispatch = useDispatch()
    const isOrderOn = useSelector(getOrderStatus)
    const total = useSelector(getSumTotal)
    const [empty, setEmpty] = useState(true)
    const [coupon, setCoupon] = useState('')
    const navigate = useNavigate();
    const message = useSelector(getMessage);
    const couponStatus = useSelector(getverifyCouponStatus);
    const formRef = useRef(null);
    const isCoupon = useSelector(getCouponStatus);
    const isdeleted = useSelector(getDeleteStatus)

    const deleteSound = useSound(DeleteFromCartSound, 0.1);
    const errorSound = useSound(ErrorSound, 0.1);
    const couponSound = useSound(CouponSound, 0.1);


    useEffect(
      () => {
          if (cart.length !== 0) {
            dispatch(addToCart(cart));
          }
          // eslint-disable-next-line
        }, [dispatch]);

        useEffect(()=>{
          if(STATUS.SUCCESS === couponStatus){
            dispatch(setcoupon(true))
            setCouponCode(true)
            couponSound();
      
          }else if(STATUS.FAILED === couponStatus){
            dispatch(setcoupon(false))
            setCouponCode(false)
            errorSound()
          }
        }, [couponStatus, couponSound, errorSound, dispatch, setCouponCode]);
        
        
      useEffect(() => {
        dispatch(setcoupon(couponCode))
        }, [dispatch, couponCode])
    
        useEffect(() => {
          if(isdeleted){
            let timer = setTimeout(() => {
              dispatch(resetDelete())
            }, 2000)
            return ()=> clearTimeout(timer)
          }
          }, [dispatch, isdeleted])
          

        useEffect(()=>{
          if(STATUS.SUCCESS === couponStatus || STATUS.FAILED === couponStatus){
            let timer = setTimeout(()=>{
              dispatch(reset())
            }, 5000)
            return ()=> clearTimeout(timer)
          }
        }, [dispatch, couponStatus])

        useEffect(()=>{
          if(cart.length === 0 && couponCode){
            setCouponCode(false)
            dispatch(removeCoupon(false))
          }
        }, [cart, dispatch, couponCode, setCouponCode])

        useEffect(() => {
            setCart(cartItems);
            // eslint-disable-next-line
          }, [cartItems]);

        const handleDelete = (index) => {
          const updatedCart = cartItems.filter((_, i) => i !== index);
          dispatch(addToCart(updatedCart));
          setCart(updatedCart);
          dispatch(deleteItem())
          deleteSound();
        };
       
      useEffect(() => {
        const newTotal = cartItems.reduce((acc, item) => {
            return acc + item.price * item.units;
        }, 0);
        dispatch(addToTotal(newTotal));
    }, [dispatch, cartItems]);

    useEffect(()=>{
      if(cartItems.length > 0){
        setEmpty(false)
      }else{
        setEmpty(true)
      }
    }, [cartItems, setCart])


    const handleCoupon = (e) =>{
      const {value} = e.target;
      setCoupon(value)
      }
  
  
    const handleSubmit = async(e) =>{
      e.preventDefault();
      const couponCode = coupon.trim()
      dispatch(verifyCoupon(couponCode))
      .then(()=> {
        
        setCoupon('')
        formRef.current.reset()
      })
    }

  return (<>
    {
      isdeleted && <CustomizedSnackbars content='Item deleted' severity='error' />
    }
    <div className={`${isOrderOn ? "order-slide-on" : "order-slide-off"} px-2 md:px-0 `}>
        <div className=' w-full my-20'>
        <IconButton
          aria-label="close"
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: 'white',
            float: 'right'
        }}
        onClick={()=> dispatch(setOrderOff())}
        >
          <CancelOutlinedIcon
           sx={{ 
            color: 'orange', 
            '&:hover': {
              color: 'orange'
              }
              }} />
        </IconButton>
        </div>
        <div className='w-full flex justify-center'>
         <div  className='bg-[#191919] 2xl:p-4 p-4 grid md:-mt-24 w-full  h-fit max-w-[450px] place-items-center mt-5'>
          <EmptyCart styleProps='w-10 h-auto my-1 mt-2' />
          <span className='text-white text-center md:text-lg my-3 w-full'>
            {cartItems.length > 0 ?
              <>
                <p className='text-base font-semibold'>Order Summary</p>
                <hr className='bg-[#272727] border-none h-[1px] w-full mt-2 mb-2 ' />
              </>
              :
              <>
                <p >You do not have any item added yet.</p>
                <p >Browse our delicious menu and add your favorite items to your cart!</p>
              </>
            }
          </span>
          <div className='w-full'>
            {cartItems.length > 0 && cartItems.map((item, idx) => (
              <div key={idx} className='w-full text-white flex items-center justify-between text-base'>
                <h2>
                  <Tooltip
                    title="Delete"
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -14],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <IconButton
                      sx={{
                        '&:hover svg': { color: 'red' },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleDelete(idx)}
                    >
                      <RemoveCircleOutlineIcon
                        sx={{ fontSize: '15px', color: '#414141' }}
                      />
                    </IconButton>
                  </Tooltip>
                  {item.units}X {item.name}
                </h2>
                <h2>£ {(item.price * item.units).toFixed(2)}</h2>
              </div>
            ))}
          </div>
          <hr className='bg-[#272727] border-none h-[1px] w-full mt-4 mb-2 ' />
          <span className='flex justify-between w-full text-white '>
            <h2 className='ml-7'>Subtotal:</h2>
            <h2>£ {(total).toFixed(2)}</h2>
          </span>
          <span className='flex justify-between w-full text-white '>
              <h2 className='ml-7'>Discount:</h2>  
              {isCoupon ? (
                <span className='whitespace-nowrap'>£ {((10 / 100) * total).toFixed(2)}</span>
              ) : (
                <span>N/A</span>
              )}
            </span>
          <button
          onClick={()=>navigate('/order/details')}
            style={{
              margin: '10px 0',
              textTransform: 'none',
              padding: '7px 60px',
              lineHeight: '1.0',
              backgroundColor: empty ? 'rgba(255, 165, 0, 0.5)' : 'orange',
              color: 'white',
              borderRadius: '4px',
              cursor: empty ? 'not-allowed' : 'pointer',
            }}
            disabled={empty}
          >
            Order
          </button>
          <form ref={formRef} onSubmit={handleSubmit} className='flex  justify-center w-full my-2 text-white relative'>
            <input
            type='text'
            required
            onChange={handleCoupon}
            readOnly={empty}
            value={coupon}
            name='coupon'
            className='p-2  focus:outline-[#1c1c1d]  outline-1 rounded-sm hover:border-black border-[1px]  text-black w-full ml-7 h-12'
            placeholder='Apply Coupon'
            />
            <button
            disabled={empty}
            type='submit'
            className='w-12 bg-white border-l-[1px]  h-11 grid place-items-center absolute top-[2px] right-[2px]'
            > {
              STATUS.LOADING === couponStatus ?
              <CircularProgress size={20} sx={{color: '#1c1c1d'}}/>
              :
              <LocalOfferOutlinedIcon sx={{color: '#1c1c1d'}} />
            }
            </button>
          </form>
        </div>
      </div>
      {
          STATUS.SUCCESS === couponStatus ?
          <CustomizedSnackbars content={message} severity='success' />
          :
          <CustomizedSnackbars content= {message} severity='error' />
        }
    </div>
  </>)
}

export default OrderSlide