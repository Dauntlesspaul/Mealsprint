import React, { useEffect } from 'react';
import './Signup.scss';
import bg from '../../assets/images/Background.png';
import icon from '../../assets/images/icon.png';
import Menu from '../../components/svgs/svg.js';
import { Button, IconButton, Box, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js';
import Sidebar from '../../components/SideBar/Sidebar.js';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import googleIcon from '../../assets/images/google.png';
import { useNavigate } from 'react-router-dom';
import OrderSlide from '../../components/OrderSlide/OrderSlide.js';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getSignupData, getSignupError, getSignupInput, getSignupStatus, setChange, userSignUp } from '../../store/signupSlice.js';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CircularProgress from '@mui/material/CircularProgress';
import VerificationModal from '../../components/Modals/VerificationModal.js';
import CustomizedSnackbars from '../../components/snackBar/SnackBar.js';
import { fetchUserData, getUserDataStatus } from '../../store/profileSlice.js';
import { STATUS } from '../../utils/status.js';
import Loading from '../../components/Loading/Loading.js';
import { getAuthStatus, googleAuth  } from '../../store/googleSlice.js';
import { useGoogleLogin } from '@react-oauth/google';
import { setOrderOff } from '../../store/orderSlice.js';

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signupForm = useSelector(getSignupInput);
  const status = useSelector(getSignupStatus)
  const error = useSelector(getSignupError)
  const userData = useSelector(getSignupData)

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const isLoading = useSelector(getUserDataStatus);

  const googleAuthStatus = useSelector(getAuthStatus)
  useEffect(() => {
    dispatch(setSidebarOff())
    dispatch(setOrderOff())
    dispatch(fetchUserData());
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = bg;
    document.head.appendChild(link);
  }, [dispatch]);

  const handleFormSubmit = (values) => {
  dispatch(userSignUp(values))
   
  };
  useEffect(()=>{
    if(STATUS.SUCCESS === isLoading){
        navigate('/user')
    }
  }, [navigate, isLoading])

  
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
    .matches(/^[A-Z][A-Za-z0-9]{5,}$/, 
      'Password must be at least 6 characters long, start with a capital letter, and contain at least one number'
    )
    .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  });

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


  if(STATUS.LOADING === isLoading){
   return <Loading/> ;
  }


  return (
    <div className='min-h-max box-border'>
      <Sidebar />
      <OrderSlide />
      <div className="relative h-[300px] ">
        <img src={bg} alt="" className="w-full h-full object-cover object-bottom" />
        <div className="absolute top-0 left-0 w-full h-full mt-7 px-3 xl:px-40 md:px-10">
          <div className='md:hidden grid place-items-center w-full'>
            <img onClick={()=>navigate('/')} src={icon} alt='' className='h-16 w-auto aspect-auto' />
          </div>
          <div className=' md:hidden flex justify-between w-full items-center my-4'>
            <IconButton
              sx={{ marginLeft: '-12px' }}
              onClick={() => { dispatch(setSidebarOn()) }}
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
              onClick={() => navigate('/login')}
            >
              {<><span className='text-white'>Login</span> <ArrowCircleRightIcon sx={{color: 'white'}} /></>}
            </Button>
          </div>
          <div className='w-full'>
            <h1 className="text-white text-center text-3xl md:text-4xl md:mt-20 leading-[43px] mt-9 font-bold">Sign Up </h1>
          </div>
        </div>
      </div>
      <div className='bg-white px-3 md:px-10 2xl:px-40 z-20 md:grid md: place-items-center'>
        <div className="rounded-lg w-full max-w-[550px] py-6">
         <div className='w-full flex justify-center mb-3'>
              <AccountCircleIcon  sx={{mr:.5, fontSize: '85px', marginBottom: '-2px'}} />
          </div>
          <h2 className='text-black text-center font-normal 2xl:text-[20px] '> Join Us - Create Your Account to Start Ordering</h2>
          <Formik
            initialValues={signupForm}
            validationSchema={validationSchema}
            onSubmit={(values) => handleFormSubmit(values)}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Box
                component="form"
                sx={{ '& > :not(style)': { m: 0, width: '100%', marginBottom: '15px' } }}
                noValidate
                autoComplete="on"
                onSubmit={handleSubmit}
              >
                <div className='p-4 shadow-md'>
                <TextField
                  id="outlined-basic"
                  name='firstName'
                  sx={{margin: '10px 0'}}
                  label="First Name"
                  variant="outlined"
                  value={values.firstName}
                  onChange={(e) => {
                    handleChange(e);
                    dispatch(setChange({ name: e.target.name, value: e.target.value }));
                  }}
                  onBlur={handleBlur}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  fullWidth
                />

                <TextField
                  id="outlined-basic2"
                  name='lastName'
                  sx={{margin: '10px 0'}}
                  label="Last Name"
                  variant="outlined"
                  value={values.lastName}
                  onChange={(e) => {
                    handleChange(e);
                    dispatch(setChange({ name: e.target.name, value: e.target.value }));
                  }}
                  onBlur={handleBlur}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  fullWidth
                />

                <TextField
                  id="outlined-basic3"
                  sx={{margin: '10px 0'}}
                  name='email'
                  label="Email"
                  type='email'
                  variant="outlined"
                  value={values.email}
                  onChange={(e) => {
                    handleChange(e);
                    dispatch(setChange({ name: e.target.name, value: e.target.value }));
                  }}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                />

                <FormControl sx={{ width: '100%', margin: '10px 0' }} variant="outlined">
                  <InputLabel htmlFor="outlined-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-password"
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

                <FormControl sx={{ width: '100%', margin: '10px 0' }} variant="outlined">
                  <InputLabel
                    sx={{
                      backgroundColor: 'white',
                      width: '200px',
                      marginLeft: '-8px',
                      padding: '0 8px',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                    htmlFor="outlined-confirm-password"
                  >
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-confirm-password"
                    name='confirmPassword'
                    type={showPassword ? 'text' : 'password'}
                    value={values.confirmPassword}
                    onChange={(e) => {
                      handleChange(e);
                      dispatch(setChange({ name: e.target.name, value: e.target.value }));
                    }}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
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
                    label="Confirm Password"
                    fullWidth
                  />
                  <FormHelperText>{touched.confirmPassword && errors.confirmPassword}</FormHelperText>
                </FormControl>
                </div>
                <Button
                  sx={{
                    backgroundColor: 'black',
                    padding: '12px 20px',
                    height: '50px',
                    fontWeight: '700',
                    borderRadius: '35px',
                    fontSize: '16px',
                    color: 'white',
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
                  <span>Sign Up</span> 
                  }
                </Button>
              </Box>
            )}
          </Formik>
          <VerificationModal status={status} data={userData} />
          <CustomizedSnackbars severity='error' content={error} />
          
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
              height: '50px',
              fontWeight: '700',
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
  );
}

export default Signup;
