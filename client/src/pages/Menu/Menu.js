import React, { useEffect, useRef, useState } from 'react';
import './Menu.scss';
import bg from '../../assets/images/Background.png';
import icon from '../../assets/images/icon.png';
import Menu, { EmptyCart } from '../../components/svgs/svg.js';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js';
import {  CircularProgress} from '@mui/material';
import Sidebar from '../../components/SideBar/Sidebar.js';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Burger from '../../components/Burger/Burger.js';
import { getDialogStatus, setDialogClose } from '../../store/dialogSlice.js';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import Dialog from '../../components/Dialog/Dialog.js';
import Chicken from '../../components/Chicken/Chicken.js';
import Meat from '../../components/Meat/Meat.js';
import Cakes from '../../components/Cakes/Cakes.js';
import Wraps from '../../components/Wrap/Wrap.js';
import { addToCart, getCartStatus, getCouponStatus, removeCoupon, setcoupon } from '../../store/cartSlice.js';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import { useLocalStorage } from '../../hooks/useLocalStorageHook.js';
import { setOrderOff, setOrderOn } from '../../store/orderSlice.js';
import OrderSlide from '../../components/OrderSlide/OrderSlide.js';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SideDishes from '../../components/SideDishes/SideDishes.js';
import { addToTotal, getSumTotal } from '../../store/orderSumSlice.js';
import { fetchSearchResults, getInputValue, getSearchResults, setSearchInput } from '../../store/searchSlice.js';
import SearchedItems from '../../components/SearchedItems/SearchedItems.js';
import { fetchUserData, getUserDataStatus } from '../../store/profileSlice.js';
import { STATUS } from '../../utils/status.js';
import Loading from '../../components/Loading/Loading.js';
import ScrollToTop from '../../components/Scroll/Button.js';
import { useNavigate } from 'react-router-dom';
import { getMessage, getverifyCouponStatus, reset } from '../../store/couponSlice.js';
import  {verifyCoupon } from '../../store/couponSlice.js';
import CustomizedSnackbars from '../../components/snackBar/SnackBar.js';
import DeleteFromCartSound from '../../assets/audio/remove.mp3';
import useSound from '../../hooks/useSoundHook.js';
import { deleteItem, getDeleteStatus, resetDelete } from '../../store/notificationSlice.js';

function Menus() {
  const dispatch = useDispatch();
  const isDialogOpen = useSelector(getDialogStatus);
  const cartItems = useSelector(getCartStatus);
  const [cart, setCart] = useLocalStorage('cart', []);
  const total = useSelector(getSumTotal)
  const value = useSelector(getInputValue)
  const searchResults = useSelector(getSearchResults)
  const isLoading = useSelector(getUserDataStatus);
  const couponStatus = useSelector(getverifyCouponStatus);
  const [empty, setEmpty] = useState(true);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [coupon, setCoupon] = useState('');
  const isCoupon = useSelector(getCouponStatus);
  const message = useSelector(getMessage)
  const [couponCode, setCouponCode] = useLocalStorage('coupon', false)
  const deleteSound = useSound(DeleteFromCartSound, 0.1);
  const isdeleted = useSelector(getDeleteStatus)

  useEffect(()=>{
    dispatch(fetchUserData())
  }, [dispatch])

  useEffect(() => {
    if (cart.length !== 0) {
      dispatch(addToCart(cart));
    }
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    setCart(cartItems);
    // eslint-disable-next-line
  }, [cartItems]);

  useEffect(()=>{
    dispatch(setSidebarOff())
    dispatch(setOrderOff())
  }, [dispatch])

  useEffect(() => {
    const newTotal = cartItems.reduce((acc, item) => {
        return acc + item.price * item.units;
    }, 0);
    dispatch(addToTotal(newTotal));
}, [dispatch, cartItems]);

useEffect(()=>{
  if(cartItems.length < 1){

  }
})

  const burgerRef = useRef(null);
  const wrapsRef = useRef(null);
  const meatRef = useRef(null);
  const cakesRef = useRef(null);
  const chickenRef = useRef(null);
  const sideRef = useRef(null);

  const handleDelete = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    dispatch(addToCart(updatedCart));
    setCart(updatedCart);
    dispatch(deleteItem())
    deleteSound();
  };

  const scrollToSection = (ref) => {
    if(searchResults.length === 0){
    ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (e, query) =>{
    e.preventDefault()
    if(query.length > 0){
    dispatch(fetchSearchResults(query))
    }
  }

  const handleInputChange = (e) => {
    dispatch(setSearchInput(e.target.value))
    dispatch(fetchSearchResults(e.target.value))
  }

  useEffect(()=>{
    if(cartItems.length > 0){
      setEmpty(false)
    }else{
      setEmpty(true)
    }
  }, [cartItems, setCart])


  useEffect(()=>{
    if(STATUS.SUCCESS === couponStatus){
     dispatch(setcoupon(true))
      setCouponCode(true)

    }else if(STATUS.FAILED === couponStatus){
      dispatch(setcoupon(false))
      setCouponCode(false)
    }
  }, [couponStatus, dispatch, setCouponCode]);


  useEffect(() => {
    dispatch(setcoupon(couponCode))
    }, [dispatch, couponCode])

   
    useEffect(()=>{
      if(cart.length === 0 && couponCode){
        setCouponCode(false)
        dispatch(removeCoupon(false))
      }
    }, [cart, dispatch, couponCode, setCouponCode])



  useEffect(()=>{
    if(STATUS.SUCCESS === couponStatus || STATUS.FAILED === couponStatus){
      let timer = setTimeout(()=>{
        dispatch(reset())
      }, 5000)
      return ()=> clearTimeout(timer)
    }
  }, [dispatch, couponStatus])



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

  useEffect(() => {
    if(isdeleted){
      let timer = setTimeout(() => {
        dispatch(resetDelete())
      }, 3000)
      return ()=> clearTimeout(timer)
    }
    }, [dispatch, isdeleted])

 
  if(STATUS.LOADING === isLoading){
    return <Loading />;
  }


  return (<>
      {
        isdeleted && <CustomizedSnackbars content='Item deleted' severity='error' />
      }
    <div className='min-h-screen bg-[#0D0D0D] pb-10'>
      <ScrollToTop/>
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
          <div className=' w-full'>
              <h1 className="text-white text-center text-3xl md:text-4xl md:mt-20 leading-[43px] mt-9 font-bold">Menu</h1>
          </div>
        </div>
      </div>
      <div className='px-3  2xl:px-40 xl:px-24 md:px-10 pb-5 z-30 md:w-fit w-full'>
        <section className='mt-5 -ml-2'>
        <ul className='max-w-[500px] text-white grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 text-sm md:text-base font-semibold justify-items-start'>
            <button className='hover:text-gray-700 w-fit' onClick={() => scrollToSection(burgerRef)}>
              <ArrowRightIcon sx={{ color: 'orange', marginLeft: '0', marginTop: '-2px' }} /> BURGERS
            </button>
            <button className='hover:text-gray-700 w-fit' onClick={() => scrollToSection(wrapsRef)}>
              <ArrowRightIcon sx={{ color: 'orange', marginLeft: '0', marginTop: '-2px' }} /> WRAPS
            </button>
            <button className='hover:text-gray-700 w-fit' onClick={() => scrollToSection(chickenRef)}>
              <ArrowRightIcon sx={{ color: 'orange', marginLeft: '0', marginTop: '-2px' }} /> CHICKEN DISHES
            </button>
            <button className='hover:text-gray-700 w-fit' onClick={() => scrollToSection(meatRef)}>
              <ArrowRightIcon sx={{ color: 'orange', marginLeft: '0', marginTop: '-2px' }} /> MEAT DISHES
            </button>
            <button className='hover:text-gray-700 w-fit' onClick={() => scrollToSection(cakesRef)}>
              <ArrowRightIcon sx={{ color: 'orange', marginLeft: '0', marginTop: '-2px' }} /> CAKES
            </button>
            <button className='hover:text-gray-700 w-fit' onClick={() => scrollToSection(sideRef)}>
              <ArrowRightIcon sx={{ color: 'orange', marginLeft: '0', marginTop: '-2px' }} /> SIDE DISHES
            </button>
          </ul>
        </section>
        <Paper
        onSubmit={(e) => handleSearch(e, value)}
          component="form"
          sx={{ p: '2px 4px', display: 'flex', backgroundColor: 'white', alignItems: 'center', width: '100%', maxWidth: '500px', my: 1 }}
        >
          <InputBase
           value={value}
           onChange={handleInputChange}
            sx={{ ml: 1, flex: 1, color: 'black' }}
            placeholder="Search"
            inputProps={{ 'aria-label': 'search ' }}
          />
          <IconButton onClick={(e) => handleSearch(e, value)} type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon  />
          </IconButton>
        </Paper>
      </div>
      <div className='px-3 xl:px-24 2xl:px-40 md:px-10 xl:gap-10 lg:justify-between lg:flex w-full md:gap-8 gap-3'>
        {searchResults && searchResults.length > 0 ?
         <SearchedItems searchResults={searchResults} />
          :
        <div className='w-fit space-y-7 '>
          <div ref={burgerRef}>
          <Burger />
          </div>
          <div ref={chickenRef}>
          <Chicken />
          </div>
          <div ref={cakesRef}>
          <Cakes />
          </div>
          <div ref={meatRef}>
          <Meat />
          </div>
          <div ref={wrapsRef}>
          <Wraps />
          </div>
          <div ref={sideRef}>
          <SideDishes />
          </div>
        </div>
          }
        <div  className=' hidden lg:grid   bg-[#191919] 2xl:p-4 2xl:py-7 p-4 lg:-mt-20 flex-1 h-fit max-w-[450px] min-w-[350px] place-items-center md:sticky md:top-20 md:z-50 mt-8'>
          <EmptyCart styleProps='w-10 h-auto my-1' />
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
                <h2 className='whitespace-nowrap'>£ {(item.price * item.units).toFixed(2)}</h2>
              </div>
            ))}
          </div>
          <hr className='bg-[#272727] border-none h-[1px] w-full mt-4 mb-2 ' />
          <span className='flex justify-between w-full text-white '>
            <h2 className='ml-7'>Subtotal:</h2>
            <h2 className='whitespace-nowrap'>£ {(total).toFixed(2)}</h2>
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
      <Dialog open={isDialogOpen} close={() => dispatch(setDialogClose())} />
    </div>
  </>);
}

export default Menus;
