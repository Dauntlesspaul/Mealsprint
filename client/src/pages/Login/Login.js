import React, {useEffect} from 'react'
import './Login.scss'
import bg from '../../assets/images/Background.png'
import icon from '../../assets/images/icon.png'
import Menu from '../../components/svgs/svg.js'
import { Button, CircularProgress, IconButton } from '@mui/material'
import {useDispatch, useSelector} from "react-redux"
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js'
import Sidebar from '../../components/SideBar/Sidebar.js'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import googleIcon from '../../assets/images/google.png'
import { useNavigate } from 'react-router-dom'
import OrderSlide from '../../components/OrderSlide/OrderSlide.js'
import { setOrderOff } from '../../store/orderSlice.js';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getAccessStatus, getLoginInput, getLoginStaus, resetLoginStatus, setChange, userLogin } from '../../store/loginSlice.js'
import {FormHelperText} from '@mui/material';
import {STATUS} from '../../utils/status.js';
import CustomizedSnackbars from '../../components/snackBar/SnackBar.js'
import { getUserLogInStatus } from '../../store/profileSlice.js'
import Loading from '../../components/Loading/Loading.js'
import { getAuthStatus, googleAuth } from '../../store/googleSlice.js';
import { useGoogleLogin } from '@react-oauth/google';
import ErrorSound from '../../assets/audio/error.mp3';
import useSound from '../../hooks/useSoundHook.js'


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const loginForm = useSelector(getLoginInput)
  const status = useSelector(getLoginStaus);
  const accessGranted = useSelector(getAccessStatus)
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const userStatus = useSelector(getUserLogInStatus);
  const googleAuthStatus = useSelector(getAuthStatus);
  const errorSound = useSound(ErrorSound, 0.1);

  const handleFormSubmit = (values) => {
    dispatch(userLogin(values))
    .then(()=>{
      const timer = setTimeout(() => {
        dispatch(resetLoginStatus());
      }, 4000); 
      return () => clearTimeout(timer); 
    })
  };

  useEffect(()=>{
    dispatch(setSidebarOff())
    dispatch(setOrderOff())
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = bg;
    document.head.appendChild(link);
  }, [dispatch])

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });


  useEffect(()=>{
    if(accessGranted || userStatus){
      navigate('/user')
    }
  }, [accessGranted, userStatus, navigate])

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(googleAuth(tokenResponse));
    },
    onError: (error) => {
      console.error('Google login error:', error);
    },
  });

  useEffect(()=>{
    if(STATUS.SUCCESS === googleAuthStatus){
      navigate('/user')
    }
  }, [navigate, googleAuthStatus])

  useEffect(()=>{
    if(STATUS.FAILED === status){
      errorSound()
    }
  }, [status, errorSound])


 if(STATUS.LOADING === userStatus){
  return <Loading /> ;
 }
  return (
    <div className='min-h-max bg-[#0D0D0D]'>
       <Sidebar />
       <OrderSlide/>
        <div className="relative h-[300px]">
          <img src={bg} alt="" className="w-full h-full object-cover object-bottom" />
          <div className="absolute top-0 left-0 w-full h-full mt-7 px-3 xl:px-40 md:px-10">
              <div  className='md:hidden grid place-items-center w-full'>
              <img onClick={()=>navigate('/')} src={icon} alt='' className='h-16  w-auto aspect-auto' />
              </div>
              <div className=' md:hidden flex justify-between w-full items-center my-4'>
                <IconButton
                sx={{
                  marginLeft: '-12px',
                }}
                onClick={()=> {dispatch(setSidebarOn())}}
                >
                <Menu />
                </IconButton>
                <Button
                 sx={{
                  backgroundColor: 'orange',
                  padding: '6px 20px',
                  marginTop: '-5px',
                  color: 'black',
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
                onClick={()=> navigate('/signup')}
                >
                  { <><span className='text-white'>Signup</span> <ArrowCircleRightIcon sx={{color: 'white'}} /></>}
                </Button>
              </div>
              <div className='w-full'>
                  <h1 className="text-white text-center text-3xl md:text-4xl md:mt-20 leading-[43px] mt-9 font-bold">Login</h1>
              </div>
          </div>
        </div>  
        <div className=' bg-white px-3 md:px-10 2xl:px-40 z-20 md:grid md: place-items-center'> 
              <div className="  w-full max-w-[550px] py-6  ">
                <div className='w-full flex justify-center mb-3'>
                  <AccountCircleIcon  sx={{mr:.5, fontSize: '85px', marginBottom: '-2px'}} />
                </div>
                <h2 className='text-black text-center font-normal 2xl:text-[20px] '> Welcome Back! - Please Log In to Access Your Account</h2>
                <Formik
                    initialValues={loginForm}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleFormSubmit(values)}
                  >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <Box
                  component="form"
                  sx={{'& > :not(style)': { m: 0, width: '100%' ,  margin: '15px 0'} }}
                  noValidate
                  autoComplete="on"
                  onSubmit={handleSubmit}
                >
                 <div className='p-3 shadow-md' >
                  <TextField 
                  id="outlined-basic" 
                  name='email'
                  label="Email" 
                  variant="outlined" 
                  value={values.email}
                  onChange={(e) => {
                    handleChange(e)
                    dispatch(setChange({name: e.target.name, value: e.target.value}))
                  }}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth />
                <FormControl sx={{width: '100%', margin: '15px 0' }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={(e) => {
                      handleChange(e);
                      dispatch(setChange({ name: e.target.name, value: e.target.value }));
                    }}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    fullWidth
                  />
                   <FormHelperText>{touched.password && errors.password}</FormHelperText>
                </FormControl>
                </div>
                <Button
                  sx={{
                    backgroundColor: 'black',
                    padding: '12px 20px',
                    height: '50px',
                    color: 'white',
                    fontWeight: '700',
                    borderRadius: '35px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    '&:hover': {
                      backgroundColor: 'black',
                      color: 'white'
                    },
                    textTransform: 'none',
                    width: '100%',
                  }}
                  type="submit"
                >
                  {
                  status === 'LOADING' ?
                  <CircularProgress 
                  sx={{color: 'white'}}
                  size={20} 
                  />
                  :
                  <span>Login</span> 
                  }
                </Button>
                </Box>
                )}
                </Formik>
                {
                  STATUS.FAILED === status && <CustomizedSnackbars severity='error' content='Invalid Login credentials!' />
                }
                  <div className='w-full  my-6 relative '>
                    <hr className='border-none h-[1px] bg-gray-300 w-full'/>
                    <div className='h-4 w-12 absolute flex items-center justify-center top-0 bg-white left-0 right-0 bottom-0 m-auto'>
                      Or
                    </div>
                  </div>
                  <Button
                  onClick={handleGoogleLogin}
                  sx={{
                    padding: '12px 20px',
                    fontWeight: '700',
                    height: '50px',
                    backgroundColor: 'white',
                    borderRadius: '35px',
                    color: "black",
                    borderColor: 'black',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    textTransform: 'none',
                    width: '100%',
                  }}
                  type="submit"
                >
                  <img className='w-5 mr-2' src={googleIcon} alt="google icon"/>
                  Sign in with Google
                </Button>
            </div>
              </div>  
    </div>
  )
}

export default 
Login