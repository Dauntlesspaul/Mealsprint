import React, {useEffect} from 'react'
import './Addresses.scss'
import bg from '../../assets/images/Background.png'
import icon from '../../assets/images/icon.png'
import Menu from '../../components/svgs/svg.js'
import { Button, IconButton,  Grid, CircularProgress, Tooltip } from '@mui/material';
import {useDispatch, useSelector} from "react-redux"
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js'
import Sidebar from '../../components/SideBar/Sidebar.js'
import { Link, useNavigate} from 'react-router-dom'
import OrderSlide from '../../components/OrderSlide/OrderSlide.js'
import { setOrderOff, setOrderOn } from '../../store/orderSlice.js';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AlertDialogSlide from '../../components/Dialog/Logout.js'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { fetchUserData, getUserData } from '../../store/profileSlice.js';
import { addressEdit, getEditStaus } from '../../store/newAddressSlice.js';
import { STATUS } from '../../utils/status.js';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { deleteAddress, getDeleteStatus } from '../../store/deleteAddressSlice.js';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { getCartStatus } from '../../store/cartSlice.js';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must be a number')
    .required('Phone number is required'),
  houseNumber: Yup.string().required('House number is required'),
  city: Yup.string().required('City is required'),
  zipCode: Yup.string()
    .matches(/^[0-9]+$/, 'Zip Code must be a number')
    .required('Zip Code is required'),
});

function Addresses() {
  const dispatch = useDispatch();
  const userData = useSelector(getUserData)
  const status = useSelector(getEditStaus)
  const deleteStatus = useSelector(getDeleteStatus)
  const cartItems = useSelector(getCartStatus);
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(setSidebarOff())
    dispatch(setOrderOff())
    dispatch(fetchUserData())
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = bg;
  document.head.appendChild(link);
  }, [dispatch])

  useEffect(()=>{
    if(!userData.firstname){
     navigate('/login')
    }
   }, [userData, navigate]);

  useEffect(()=>{
    if(STATUS.SUCCESS === status){
      dispatch(fetchUserData())
    }
}, [dispatch, status])

useEffect(()=>{
  if(STATUS.SUCCESS === deleteStatus){
    dispatch(fetchUserData())
  }
}, [dispatch, deleteStatus])
  
  return (
    <div className='min-h-screen bg-[white]'>
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
              <div className='w-full'>
              <h1 className="text-white text-center md:text-center text-3xl md:text-4xl md:mt-20 leading-[43px] mt-9 font-bold">My Profile</h1>
              </div>
          </div>
        </div>  
        <div className='px-3 md:px-10 xl:px-24 2xl:px-40 md:flex md:gap-8 py-5'>
          <div className='shadow-md h-fit border border-[#e0e0e0] divide-[#e0e0e0] rounded-sm divide-y-[1px] md:w-[30%]'>
            <Link to='/user' className='block'>
            <div className='w-ful flex hover:bg-gray-100 justify-between px-3 items-center h-12 '>
                <span>My Account</span> <ArrowRightIcon sx={{color: 'orange'}}/>
            </div>
            </Link>
            <div className='w-ful text-white bg-[orange] flex justify-between px-3 items-center h-12'>
                <span>Address</span> <ArrowRightIcon sx={{color: 'white'}}/>
            </div>
            <Link to='/user/orders' className='block'>
            <div className='w-ful flex hover:bg-gray-100 justify-between px-3 items-center h-12'>
                <span>My Orders</span> <ArrowRightIcon sx={{color: 'orange'}}/>
            </div>
            </Link>
            <AlertDialogSlide />
          </div>

          <div className='shadow-md h-fit mt-5 md:mt-0 px-3 md:flex-1 border-[1px] border-[#e0e0e0] rounded-sm py-3 md:py-0'>
          <h2 className=' md:mt-5 my-3 font-medium'> <RoomOutlinedIcon sx={{marginTop: '-3px'}} /> Addresses</h2>
          <hr className='my-2 border-none h-[1px] bg-[#e0e0e0]'/>
          {userData && Array.isArray(userData.addresses) && userData.addresses.length > 0 ?
          (<ul>
          {
            userData.addresses.map((address, index) => (
              <li key={index}>
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
                      onClick={()=>dispatch(deleteAddress(address._id))}
                    >
                      <RemoveCircleOutlineIcon
                        sx={{ fontSize: '15px', color: '#414141' }}
                      />
                    </IconButton>
                  </Tooltip>
                {address.houseno + ', ' + address.city + ', ' + address.zipcode + ', ' + address.phone + '.'}</li>
            ))
          }
          </ul>
          )
          :
          (
            <span className=' italic'>No address found</span>
          )
         }
         <div className='shadow-md p-3 mb-3 rounded-sm'> 
          <h3 className='mt-4'>New address</h3>
          <Formik
            initialValues={{
              phoneNumber: userData.phone || '',
              houseNumber: '',
              city: '',
              zipCode: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              dispatch(addressEdit(values));
              resetForm();
            }}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form >
                <Box
                  sx={{
                    '& > :not(style)': { m: 0, p: 0, width: '100%', marginBottom: '20px', },
                  }}
                  noValidate
                  autoComplete="on"
                >
                  <Grid container spacing={0.5}>
                    <Grid item xs={12} sx={{my:1}}  xl={6}>
                      <TextField
                        id="outlined-basic"
                        name="phoneNumber"
                        type="tel"
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{my:1}}  xl={6}>
                      <TextField
                        id="outlined-basic"
                        name="houseNumber"
                        label="House Number"
                        variant="outlined"
                        fullWidth
                        value={values.houseNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.houseNumber && Boolean(errors.houseNumber)}
                        helperText={touched.houseNumber && errors.houseNumber}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{my:1}}  xl={6}>
                      <TextField
                        id="outlined-basic"
                        name="city"
                        label="City"
                        variant="outlined"
                        fullWidth
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{my:1}}  xl={6}>
                      <TextField
                        id="outlined-basic"
                        name="zipCode"
                        label="Zip Code"
                        variant="outlined"
                        fullWidth
                        value={values.zipCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.zipCode && Boolean(errors.zipCode)}
                        helperText={touched.zipCode && errors.zipCode}
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
                      {STATUS.LOADING === status ?
                      <CircularProgress 
                      sx={{color: 'white'}} 
                      size={20} />
                      :
                      <span>Add New Address</span>
                      }
                    </Button>
                  </div>
                </Box>
              </Form>
            )}
          </Formik>
          </div>
        </div>
        </div>
       
    </div>
  )
}

export default Addresses