import React, { useState, useEffect } from 'react';
import './Success.scss';
import ConfettiComponent from '../../utils/ConfettiComponent.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { Success } from '../../components/svgs/svg.js';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../store/profileSlice.js';
import { addToCart } from '../../store/cartSlice.js';

function SuccessPage() {
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector(getUserData);
  const dispatch = useDispatch()

  useEffect(() => {
    if (!location.state || location.state.from !== 'checkout') {
      navigate('/menu');
    } else {
      setTriggerConfetti(true);

      setTimeout(() => {
        setTriggerConfetti(false);
      }, 4000);

      setTimeout(() => {
        localStorage.removeItem('cart');
        localStorage.removeItem('coupon');
        dispatch(addToCart([]))
      }, 1000);
    }
  }, [location.state, dispatch, navigate]);

  return (
    <>
      <div className=" bg-[#0D0D0D] z-40 w-full h-dvh grid place-items-center fixed top-0 bottom-0">
        <div className="bg-white lg:w-[700px] grid place-items-center shadow-md w-11/12 h-[50%]  rounded-sm">
          <div className="h-fit w-fit grid place-items-center lg:px-5 px-2 text-sm md:text-base">
            <Success w="80" styleProp="lg:my-8 my-5" fillColor="green" />
            <h2 className="text-base md:text-2xl font-semibold">Thank you for your order!</h2>
            <p className="mb-3 text-gray-700 text-center">
              Thank you for your order! We're thrilled to prepare and deliver your meals soon. A receipt has been sent to your email. We appreciate your trust in our service and hope you enjoy every bite. Bon appétit!
            </p>
            <div className="flex space-x-2 lg:my-7 my-4 ">
              {userData.firstname && (
                <Button
                  variant="outlined"
                  sx={{ color: 'black', borderColor: 'black' }}
                  onClick={() => navigate('/user/orders')}
                >
                  View Order
                </Button>
              )}
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate('/menu')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
          <ConfettiComponent trigger={triggerConfetti} />
        </div>
      </div>
    </>
  );
}

export default SuccessPage;
