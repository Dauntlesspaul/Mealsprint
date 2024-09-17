import React, {useEffect, useState} from 'react';
import './Profile.scss';
import bg from '../../assets/images/Background.png';
import icon from '../../assets/images/icon.png';
import Menu from '../../components/svgs/svg.js';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js';
import Sidebar from '../../components/SideBar/Sidebar.js';
import { Link, useNavigate } from 'react-router-dom';
import OrderSlide from '../../components/OrderSlide/OrderSlide.js';
import { setOrderOff, setOrderOn } from '../../store/orderSlice.js';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import BasicModal from '../../components/Modals/Profilemodal.js';
import { fetchUserData, getUserData, getUserDataStatus} from '../../store/profileSlice.js';
import { getEditStaus } from '../../store/profileEditSlice.js';
import AlertDialogSlide from '../../components/Dialog/Logout.js';
import {InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { STATUS } from '../../utils/status.js';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { changePassword, getchangePasswordStatus, resetState} from '../../store/changePasswordSlice.js';
import CustomizedSnackbars from '../../components/snackBar/SnackBar.js';
import { getPicDialogueState, setClose, setOpen } from '../../store/pictureSlice.js';
import CustomizedDialogs from '../../components/Dialog/ProfilePicture.js';
import CropperComponent from '../../components/Cropper/Cropper.js';
import { getCropperStatus, getImageData } from '../../store/cropedImageSlice.js';
import Loading from '../../components/Loading/Loading.js';
import { getErrorMessage, getPasswordCheckStatus, getPasswordStatus, passwordCheck } from '../../store/passwordSlice.js';
import { getsetPasswordStatus, setPassword } from '../../store/setPasswordSlice.js';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { getCartStatus } from '../../store/cartSlice.js';

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current Password is required'),
  
  newPassword: Yup.string()
    .matches(/^[A-Z][A-Za-z0-9]{5,}$/, 
      'New Password must be at least 6 characters long, start with a capital letter, and contain at least one number'
    )
    .required('New Password is required'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const validationSchemas = Yup.object({
  newPassword: Yup.string()
    .matches(/^[A-Z][A-Za-z0-9]{5,}$/, 
      'New Password must be at least 6 characters long, start with a capital letter, and contain at least one number'
    )
    .required('New Password is required'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});
function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const editStatus = useSelector(getEditStaus)
  const [showPassword, setShowPassword] = useState(false);
  const userData = useSelector(getUserData)
  const loggedInStatus = useSelector(getUserDataStatus)
  const passwordStatus = useSelector(getchangePasswordStatus)
  const picDialogueState = useSelector(getPicDialogueState);
  const isCropperOn = useSelector(getCropperStatus);
  const cropperImage = useSelector(getImageData);
  const hasPassword = useSelector(getPasswordStatus)
  const isPassword = useSelector(getPasswordCheckStatus)
  const errorMessage = useSelector(getErrorMessage)
  const newPasswordStatus = useSelector(getsetPasswordStatus)
  const cartItems = useSelector(getCartStatus);
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };


  useEffect(()=>{
    dispatch(setSidebarOff())
    dispatch(passwordCheck())
    dispatch(setOrderOff())
    dispatch(fetchUserData())
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = bg;
    document.head.appendChild(link);
  }, [dispatch, editStatus])
  
  


  useEffect(()=>{
   if(STATUS.SUCCESS === passwordStatus || STATUS.FAILED === passwordStatus){
    let timer = setTimeout(()=>{
      dispatch(resetState());
    }, 4000);
    return () => clearTimeout(timer);
   }
  }, [dispatch, passwordStatus]);

  useEffect(()=>{
    if(STATUS.SUCCESS === newPasswordStatus || STATUS.FAILED === newPasswordStatus){
     let timer = setTimeout(()=>{
       dispatch(resetState());
     }, 4000)
    
      navigate(0);
     return () => clearTimeout(timer);
    }
   }, [dispatch,navigate, newPasswordStatus]);
 
  useEffect(()=>{
    if(loggedInStatus === STATUS.FAILED){
      navigate('/login')
    }
  }, [navigate, loggedInStatus])

  if (!userData.firstname || isPassword === STATUS.LOADING) {
    return <Loading/>;
  }
 
  return (<>

    { isCropperOn ? 
    (  cropperImage && (
      <div className="fixed inset-0 z-50 flex">
        <CropperComponent  image={cropperImage}/> 
      </div>
      )  
    ):( <div className='min-h-screen bg-[white]'>
          <Sidebar />
          <OrderSlide/>
            <div className="relative h-[300px]">
              <img src={bg} alt="" className="w-full h-full object-cover object-bottom" />
              <div className="absolute top-0 left-0 w-full h-full mt-7 px-4 xl:px-40 md:px-30">
                  <div className='md:hidden grid place-items-center w-full'>
                  <img onClick={()=>navigate('/')} src={icon} alt='' className='h-16 w-auto aspect-auto' />
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
                    <div onClick={()=>dispatch(setOrderOn())}  className='relative cursor-pointer'>
                    <ShoppingCartIcon sx={{ color: 'white', fontSize: '35px' }} />
                    <div className='w-3 h-3 rounded-full bg-red-700 text-white flex items-center justify-center absolute top-0 right-0 text-[10px]'>{cartItems.length}</div>
                  </div>
                  </div>
                  <div className=' w-full'>
                     <h1 className="text-white text-center md:text-center text-3xl md:text-4xl md:mt-20 leading-[43px] mt-9 font-bold">My Profile</h1>
                </div>
              </div>
            </div>  
            <div className=' px-3 md:px-10 xl:px-24 2xl:px-40 md:flex md:gap-8 py-5'>
            <div className='border shadow-md border-[#e0e0e0] divide-[#e0e0e0] rounded-sm divide-y-[1px] md:w-[30%] h-fit'>
              <div className='w-full flex justify-between px-3 items-center bg-[orange] h-12 text-white'>
                <span>My Account</span> <ArrowRightIcon sx={{ color: 'white' }} />
              </div>
              <Link to='/user/address' className='block'>
                <div className='w-full hover:bg-gray-100 flex justify-between px-3 items-center h-12'>
                  <span>Address</span> <ArrowRightIcon sx={{ color: 'orange' }} />
                </div>
              </Link>
              <Link to='/user/orders' className='block'>
                <div className='w-full flex hover:bg-gray-100 justify-between px-3 items-center h-12'>
                  <span>My Orders</span> <ArrowRightIcon sx={{ color: 'orange' }} />
                </div>
              </Link>
              <AlertDialogSlide />
            </div>
              <div className='mt-5 md:mt-0 px-3 md:flex-1 border-[1px] rounded-sm border-[#e0e0e0] shadow-md pb-3 '>
              <h2 className='md:mt-5 my-3 font-medium md:text-lg'> <AccountCircleOutlinedIcon sx={{marginTop: '-3px'}}/> My Account</h2>
              <hr className='my-2 border-none h-[1px] bg-[#e0e0e0]'/>
             <div className='shadow-md p-3 rounded-sm'> 
              <Button 
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  height: '128px',
                  width: '128px',
                  backgroundColor: 'rgb(202 138 4)',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '20px 0',
                  padding: 0,
                  '&:hover': {
                    backgroundColor: 'rgb(202 138 4)',
                  },
                }}
                onClick={() => dispatch(setOpen())}
              >
                {userData.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover', 
                    }}
                    alt=''
                  />
                ) : (
                  <h2 className='text-white text-6xl'>{userData.firstname.charAt(0)}</h2>
                )}
              </Button>
              <h4><strong>Name:</strong> {userData.firstname + ' ' + userData.lastname}</h4>
              <h4><strong>Email:</strong> {userData.email}</h4>
              <h4><strong>Phone:</strong> {userData.phone}</h4>
              <div className='flex justify-end'>
            
                <BasicModal userData={userData} />
                <CustomizedDialogs open={picDialogueState} close={()=>dispatch(setClose())} />
            
              </div>
              </div>
              {
                STATUS.SUCCESS === passwordStatus ? (
                  <CustomizedSnackbars content="Password Successfully Changed!" severity="success" />
                ) : (
                  STATUS.FAILED === passwordStatus && (
                    <CustomizedSnackbars content="Incorrect Current Password!" severity="error" />
                  )
                )
              }
               {
                STATUS.SUCCESS ===newPasswordStatus ? (
                  <CustomizedSnackbars content="Your new password has been successfully set!" severity="success" />
                ) : (
                  STATUS.FAILED === newPasswordStatus && (
                    <CustomizedSnackbars content="Error" severity="error" />
                  )
                )
              }
              <h4 className='font-medium mt-12 md:text-lg'> <SettingsOutlinedIcon sx={{marginTop: '-3px'}}/>Password Management</h4>
              <hr className='my-2 border-none h-[1px] bg-[#e0e0e0]'/>
              <div className='shadow-md p-3 rounded-sm'> 
               {hasPassword ?
               (<>
                <h4 className='ml-2'>Change Password</h4>
                <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                dispatch(changePassword(values));
                resetForm();
              }}
            >
              {({ values, handleChange, handleBlur, errors, touched }) => (
                <Form>
                  <Box
                    sx={{
                      '& > :not(style)': { m: 0, p: 0, width: '100%', marginBottom: '20px' }
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <Grid container spacing={0.5} >
                      <Grid item xs={12} sx={{my:1}} xl={6}>
                        <TextField
                          id="outlined-basic1"
                          name="currentPassword"
                          label="Current Password"
                          type={showPassword ? 'text' : 'password'}
                          variant="outlined"
                          fullWidth
                          value={values.currentPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.currentPassword && Boolean(errors.currentPassword)}
                          helperText={touched.currentPassword && errors.currentPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{my:1}} xl={6}>
                        <TextField
                          id="outlined-basic2"
                          name="newPassword"
                          label="New Password"
                          type={showPassword ? 'text' : 'password'}
                          variant="outlined"
                          fullWidth
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.newPassword && Boolean(errors.newPassword)}
                          helperText={touched.newPassword && errors.newPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{my:1}} xl={6}>
                        <TextField
                          id="outlined-basic3"
                          name="confirmPassword"
                          label="Confirm Password"
                          type={showPassword ? 'text' : 'password'}
                          variant="outlined"
                          fullWidth
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        sx={{
                          textTransform: 'none',
                          backgroundColor: 'green',
                          width: '150px',
                          height: '40px',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'green',
                          },
                        }}
                      >
                        {
                          STATUS.LOADING === passwordStatus ?
                          <CircularProgress sx={{color: 'white'}} size={20} />
                          :
                          <span>Update Password</span>
                        }
                      </Button>
                    </div>
                  </Box>
                </Form>
              )}
              </Formik> 
              </>)
              : (              
             <>
             <h3 className=' text-red-600'>⚠ {errorMessage}</h3>
              <h4 className='ml-1'>Set Password</h4>
                <Formik
                initialValues={{
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchemas}
              onSubmit={(values, { resetForm }) => {
                dispatch(setPassword(values));
                resetForm();
              }}
            >
              {({ values, handleChange, handleBlur, errors, touched }) => (
                <Form>
                  <Box
                    sx={{
                      '& > :not(style)': { m: 0, p: 0, width: '100%', marginBottom: '20px' }
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <Grid container spacing={0.5} >
                      <Grid item xs={12} xl={6} sx={{my:1}}>
                        <TextField
                          id="outlined-basic4"
                          name="newPassword"
                          label="New Password"
                          type={showPassword ? 'text' : 'password'}
                          variant="outlined"
                          fullWidth
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.newPassword && Boolean(errors.newPassword)}
                          helperText={touched.newPassword && errors.newPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} xl={6} sx={{my:1}}>
                        <TextField
                          id="outlined-basic5"
                          name="confirmPassword"
                          label="Confirm Password"
                          type={showPassword ? 'text' : 'password'}
                          variant="outlined"
                          fullWidth
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        sx={{
                          textTransform: 'none',
                          backgroundColor: 'green',
                          width: '150px',
                          height: '40px',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'green',
                          },
                        }}
                      >
                        {STATUS.LOADING === newPasswordStatus ?
                         <CircularProgress size={20} sx={{color: 'white'}} />
                         :
                          <span>Set Password</span>
                        }
                      </Button>
                    </div>
                  </Box>
                </Form>
              )}
              </Formik>
              </>)
                }
            </div>
            </div>
            </div>
        </div>)
      }
  </>)
}

export default Profile