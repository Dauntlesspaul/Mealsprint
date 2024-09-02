import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Box, TextField, Autocomplete } from '@mui/material';
import CustomizedSnackbars from '../../components/snackBar/SnackBar';
import { useNavigate } from 'react-router-dom';



const CheckoutForm = ({name, address, email}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();


  

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        //return_url: 'http://localhost:3000/success',
        payment_method_data: {
          billing_details: {
            name,
            email,
            address,
          },
        },
      },
      redirect: 'if_required',// disabled automatic comfirmation and redirect from stripe
    });

    if (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment successful!');
      navigate('/success', { state: { from: 'checkout' } });
    } else {
      console.log('Payment not succeeded, status:', paymentIntent?.status);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            InputProps={{
              readOnly: true,
            }}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            InputProps={{
              readOnly: true,
            }}
            required
          />
        </Box>
        <Box mb={2}>
        <Autocomplete
            freeSolo={false} 
            options={[]} 
            renderInput={(params) => (
              <TextField
                {...params}
                label="Delivery Address"
                InputProps={{ ...params.InputProps, readOnly: true }}
                required
              />
            )}
            value={address} 
            disableClearable 
          />
        </Box>
        <PaymentElement />
        {errorMessage && (
          <Box mt={2} color="red">
            {errorMessage}
          </Box>
        )}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={!stripe}>
            Pay
          </Button>
        </Box>
      </form>
      {errorMessage && <CustomizedSnackbars content={errorMessage} severity='error' />}
    </>
  );
};

export default CheckoutForm;
