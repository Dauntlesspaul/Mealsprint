import React, { useEffect } from 'react';
import './Header.scss';
import icon from '../../assets/images/icon.png';
import { Link, useLocation } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCartStatus } from '../../store/cartSlice';
import { setOrderOn } from '../../store/orderSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { fetchUserData, getUserData, getUserDataStatus } from '../../store/profileSlice';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import OrderSlide from '../OrderSlide/OrderSlide';
import { STATUS } from '../../utils/status';
import Loading from '../Loading/Loading';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const cartItems = useSelector(getCartStatus)
  const dispatch = useDispatch()

 
  const userData = useSelector(getUserData);
  const isLoading = useSelector(getUserDataStatus);

  useEffect(() => {
    if (currentPath !== '/login' && currentPath !== '/signup') {
      dispatch(fetchUserData());
    }
  }, [dispatch, currentPath]);

  const handleCartItems = () => {
    if(currentPath !== '/menu'){
      dispatch(setOrderOn())
    }
    else if(window.innerWidth <= 1024  && currentPath === '/menu'){
      dispatch(setOrderOn())
    }
  }

 const handleNavigation = () =>{
   switch(currentPath){
    case '/signup':
      navigate('/login')
      break;
    case '/login':
      navigate('/signup')
      break;
    default:
      return navigate('/signup')
   }

 }

 if(STATUS.LOADING === isLoading){
  return <Loading/> ;
 }

  return (
    <header className='h-16 hidden md:block bg-[#000000]'>
      <nav className='w-full flex items-center justify-between 2xl:px-40 xl:px-24 md:px-10'>
        <div className='flex flex-grow items-center space-x-4 justify-between'>
          <Link to='/'>
            <span className='text-white font-semibold'>
              Home
              {currentPath === '/' && <hr className='border-none h-1 bg-[orange]' />}
            </span>
          </Link>
          <Link to='/menu'>
            <span className='text-white font-semibold'>
              Menu
              {currentPath === '/menu' && <hr className='border-none h-1 bg-[orange]' />}
            </span>
          </Link>
          <Link to='/about'>
            <span className='text-white font-semibold'>
              About Us
              {currentPath === '/about' && <hr className='border-none h-1 bg-[orange]' />}
            </span>
          </Link>
            <span className='text-white font-semibold'>
              Contact
              {currentPath === '/contact' && <hr className='border-none h-1 bg-[orange]' />}
            </span>
        </div>
        <div onClick={()=> navigate('/')} className='flex-grow cursor-pointer flex justify-center'>
          <img src={icon} alt='icon' className='h-16 w-auto' />
        </div>
        <div className='flex flex-grow items-center justify-between space-x-4'>
          <button 
          onClick={handleCartItems}
          className='relative'>
            <ShoppingCartIcon sx={{ color: 'white', fontSize: '35px' }} />
            <div className='w-3 h-3 rounded-full bg-red-700 text-white flex items-center justify-center absolute top-0 right-0 text-[10px]'>{cartItems.length}</div>
          </button>
          {userData.firstname ?  (
            <Link to='/user'>
              <div className='flex items-center'>
                <AccountCircleIcon sx={{color: 'white', mr:1,}}/>
                <h1 className='text-white text-base'>Welcome, {userData.firstname}</h1>
              </div>
            </Link>
          )
          : (
            <Button
              sx={{
                backgroundColor: 'orange',
                padding: '10px 20px',
                color: 'white',
                fontWeight: '700',
                borderRadius: '35px',
                fontSize: '14px',
                lineHeight: '1.0',
                '&:hover': {
                  backgroundColor: 'orange'
                },
                textTransform: 'none',
                minHeight: 'auto',
                minWidth: 'auto'
              }}
              onClick={handleNavigation}
            >
              {currentPath === '/'  || currentPath === '/checkout' || currentPath === '/menu' || currentPath === '/order/details' || currentPath === '/about' || currentPath === '/login' ? (<><span>Become a member</span><ArrowCircleRightIcon /></>) : 
              (<><span>Login</span><ArrowCircleRightIcon /></>)
            }
            </Button>)
         }
        </div>
      </nav>
      <OrderSlide />
    </header>
  );
}

export default Header;
