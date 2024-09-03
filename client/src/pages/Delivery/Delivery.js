import React, { useEffect } from 'react';
import './Delivery.scss';
import bg from '../../assets/images/Background.png';
import icon from '../../assets/images/icon.png';
import Menu from '../../components/svgs/svg.js';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js';
import Sidebar from '../../components/SideBar/Sidebar.js';
import OrderSlide from '../../components/OrderSlide/OrderSlide.js';
import { setOrderOff, setOrderOn } from '../../store/orderSlice.js';
import { getUserDataStatus, fetchUserData, getUserData } from '../../store/profileSlice.js';
import Loading from '../../components/Loading/Loading.js';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { STATUS } from '../../utils/status.js';
import TwoWheelerOutlinedIcon from '@mui/icons-material/TwoWheelerOutlined';
import { getCartStatus } from '../../store/cartSlice.js';
import { setDetails } from '../../store/deliverySlice.js';

const addresses = [
  { label: '10 Queen Street, Wolverhampton, WV1 3BX', value: '10 Queen Street, Wolverhampton, WV1 3BX' },
  { label: '25 Lichfield Street, Wolverhampton, WV1 1DQ', value: '25 Lichfield Street, Wolverhampton, WV1 1DQ' },
  { label: '15 Bilston Road, Wolverhampton, WV2 2QX', value: '15 Bilston Road, Wolverhampton, WV2 2QX' },
  { label: '8 Thornley Street, Wolverhampton, WV2 3ED', value: '8 Thornley Street, Wolverhampton, WV2 3ED' },
  { label: '30 Tettenhall Road, Wolverhampton, WV3 9NH', value: '30 Tettenhall Road, Wolverhampton, WV3 9NH' },
  { label: '45 Finchfield Road, Wolverhampton, WV3 8AH', value: '45 Finchfield Road, Wolverhampton, WV3 8AH' },
  { label: '1 Darlington Street, Wolverhampton, WV1 4HW', value: '1 Darlington Street, Wolverhampton, WV1 4HW' },
  { label: '33 Waterloo Road, Wolverhampton, WV1 4DJ', value: '33 Waterloo Road, Wolverhampton, WV1 4DJ' },
  { label: '50 Dudley Street, Wolverhampton, WV1 3ER', value: '50 Dudley Street, Wolverhampton, WV1 3ER' },
  { label: '12 Chapel Ash, Wolverhampton, WV3 0TN', value: '12 Chapel Ash, Wolverhampton, WV3 0TN' },
  { label: '7 Worcester Street, Wolverhampton, WV2 4LD', value: '7 Worcester Street, Wolverhampton, WV2 4LD' },
  { label: '14 Snow Hill, Wolverhampton, WV2 4AG', value: '14 Snow Hill, Wolverhampton, WV2 4AG' },
  { label: '60 Stafford Street, Wolverhampton, WV1 1PE', value: '60 Stafford Street, Wolverhampton, WV1 1PE' },
  { label: '80 Berry Street, Wolverhampton, WV1 1HA', value: '80 Berry Street, Wolverhampton, WV1 1HA' },
  { label: '23 Newhampton Road West, Wolverhampton, WV6 0RU', value: '23 Newhampton Road West, Wolverhampton, WV6 0RU' },
  { label: '5 Birch Street, Wolverhampton, WV1 4JH', value: '5 Birch Street, Wolverhampton, WV1 4JH' },
];

// List of valid address values
const validAddressValues = addresses.map((option) => option.value);

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must be digits only')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  address: Yup.string()
    .required('Address is required')
    .oneOf(validAddressValues, 'Service not available within the selected location'), 
});

function Delivery() {
  const dispatch = useDispatch();
  const userStatus = useSelector(getUserDataStatus);
  const cartItems = useSelector(getCartStatus);
  const navigate = useNavigate();
  const userData = useSelector(getUserData)

  useEffect(() => {
    dispatch(setSidebarOff());
    dispatch(setOrderOff());
    dispatch(fetchUserData());
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = bg;
  document.head.appendChild(link);
  }, [dispatch]);

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
          <div className='md:hidden grid place-items-center w-full'>
            <img onClick={()=>navigate('/')} src={icon} alt='' className='h-16 w-auto aspect-auto' />
          </div>
          <div className='md:hidden flex justify-between w-full items-center my-4'>
            <IconButton
              sx={{ marginLeft: '-12px' }}
              onClick={() => { dispatch(setSidebarOn()) }}
            >
              <Menu />
            </IconButton>
            <div onClick={() => dispatch(setOrderOn())} className='relative cursor-pointer'>
              <ShoppingCartIcon sx={{ color: 'white', fontSize: '35px' }} />
              <div className='w-3 h-3 rounded-full bg-red-700 text-white flex items-center justify-center absolute top-0 right-0 text-[10px]'>{cartItems.length}</div>
            </div>
          </div>
          <div className='w-full'>
            <h1 className="text-white text-center text-3xl md:text-4xl md:mt-20 leading-[43px] mt-9 font-bold">Order Details</h1>
          </div>
        </div>
      </div>
      <div className='bg-white grid  place-items-center px-3 py-7'>
        <h2 className=' text-center md:text-2xl text-lg'>Delivery Availability</h2>
        <div className='flex justify-self-center shadow-md p-1'>
          <TwoWheelerOutlinedIcon sx={{ fontSize: { md: '33px', xs: '28px' }, marginTop: '-4px', marginRight: '5px' }} />
          <p className='text-center text-[gray] md:text-xl text-lg'>8:00 am - 22:00 pm</p>
        </div>
        <div className='max-w-[550px] w-full p-3 shadow-md'>
          <Formik
            initialValues={{ name:userData?.firstname && userData?.lastname ? `${userData.firstname} ${userData.lastname}` : '', 
            email: userData.email || '', 
            phone: userData.phone || '', address: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              dispatch(setDetails(values));
              navigate('/order/checkout');
            }}
          >
            {({ setFieldValue, values }) => (
              <Form>
                <Box mb={2}>
                  <Field name="name" as={TextField} label="Name" fullWidth />
                  <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                </Box>
                <Box mb={2}>
                  <Field name="email" as={TextField} label="Email" type="email" fullWidth />
                  <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                </Box>
                <Box mb={2}>
                  <Field 
                  name="phone" 
                  as={TextField}  
                  inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',    
                      }}
                  label="Phone Number"
                  fullWidth />
                  <ErrorMessage name="phone" component="div" style={{ color: 'red' }} />
                </Box>
                <Box mb={2}>
                  <Autocomplete
                    freeSolo
                    options={addresses.map((option) => option.value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Delivery Address" required />
                    )}
                    value={values.address}
                    onChange={(event, newValue) => {
                      setFieldValue('address', newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      setFieldValue('address', newInputValue);
                    }}
                  />
                  <ErrorMessage name="address" component="div" style={{ color: 'red' }} />
                </Box>
                <Box mt={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Delivery;
