import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLetterStatus, reset, subscribeNewsletter } from '../../store/newsletterSlice';
import { STATUS } from '../../utils/status';
import CustomizedSnackbars from '../snackBar/SnackBar';

function Subscribe() {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [data, setData] = useState({ email: '' });
  const status = useSelector(getLetterStatus);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  useEffect(() => {
    if (status === STATUS.SUCCESS) {
      formRef.current.reset();   
      setData({ email: '' }); 
      let timer = setInterval(()=>{
        dispatch(reset())
      }, 4000)  
      return ()=> clearTimeout(timer);
    }
  }, [status, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(subscribeNewsletter(data));
  };

  return (<>
    {STATUS.SUCCESS === status && <CustomizedSnackbars severity='success' content='Subscription successful!' />}
    <div className="w-full h-56 grid place-items-center -space-y-16 mt-20 bg-white">
      <h2 className='font-bold text-2xl xl:text-[35px] lg:text-[26px]'>For more Support</h2>
      <form ref={formRef} onSubmit={handleSubmit} className='grid w-full md:flex md:items-center md:space-y-0 md:gap-4 max-w-[600px] place-items-center space-y-3'>
        <input
          type="email"
          name="email"
          value={data.email}
          required
          onChange={handleChange}
          placeholder="Enter Email"
          className="p-3 h-11 rounded-3xl w-5/6 border border-black focus:outline-none"
        />
        <Button
          type='submit'
          sx={{
            background: 'black',
            width: '83.33%',
            borderRadius: '30px',
            color: 'white',
            height: '44px',
            fontWeight: '700',
            textTransform: 'none',
            '@media (min-width: 767px)': {
              width: 'max-content',
              padding: '3px 20px',
            },
            '&:hover': {
              background: 'black'
            }
          }}
        >
          {status === STATUS.LOADING ? (
            <CircularProgress sx={{ color: 'white' }} size={20} />
          ) : (
            <span>Subscribe</span>
          )}
        </Button>
      </form>
    </div>
    </>);
}

export default Subscribe;
