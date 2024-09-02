import * as React from 'react';
import Modal from '@mui/material/Modal';
import { Box, CircularProgress, TextField, Typography } from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import { getTimeLeft, resetCountDown, setCountDown } from '../../store/countDownSlice.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVerificationMessage, getVerificationStatus, getVerifyingStatus, verifyUser } from '../../store/verificationSlice.js';
import { useNavigate } from 'react-router-dom';
import { STATUS } from '../../utils/status.js';

export default function VerificationModal({ status, data }) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const timeLeft = useSelector(getTimeLeft);
  const isVerified = useSelector(getVerificationStatus);
  const verificationMessage = useSelector(getVerificationMessage);
  const navigate = useNavigate();
  const verificationCheck = useSelector(getVerifyingStatus)

  const handleOpen = () => setOpen(true);
  const handleClose = React.useCallback(() => {
    setOpen(false);
    dispatch(resetCountDown());
  }, [dispatch]);

  const formatTime = React.useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && status === 'SUCCESS') {
      timer = setInterval(() => {
        dispatch(setCountDown());
      }, 1000);
    } else if (timeLeft === 0) {
      setOpen(false);
      dispatch(resetCountDown());
    }

    return () => clearInterval(timer);
  }, [timeLeft, status, dispatch]);

  React.useEffect(() => {
    if (status === 'SUCCESS') {
      handleOpen();
    }
  }, [status]);

  React.useEffect(() => {
    if (isVerified) {
      navigate('/user');
    }
  }, [isVerified, navigate]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '90%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 500,
            height: 300,
            bgcolor: 'background.paper',
            display: 'grid',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
          }}
        >
          <Formik
            initialValues={{ code: ['', '', '', '', '', ''] }}
            onSubmit={(values, { setSubmitting }) => {
              const code = values.code.join('');
              setSubmitting(true);
              dispatch(verifyUser({ code, email: data.email }));
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting, setSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Typography
                  variant="h6"
                  sx={{ marginBottom: 2, textAlign: 'center', fontSize: '17px' }}
                >
                  Enter the verification digit sent to your email
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <FieldArray name="code">
                    {() =>
                      values.code.map((digit, index) => (
                        <TextField
                          key={index}
                          name={`code[${index}]`}
                          value={digit}
                          onChange={(e) => {
                            handleChange(e);

                            if (e.target.value && index < 5) {
                              document.getElementById(`code-${index + 1}`).focus();
                            }

                            const updatedValues = [
                              ...values.code.slice(0, index),
                              e.target.value,
                              ...values.code.slice(index + 1),
                            ];
                            if (updatedValues.every((val) => val !== '')) {
                              handleSubmit();  
                            }
                          }}
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center', fontSize: '20px' },
                            inputMode: 'numeric', 
                            pattern: '[0-9]*', 
                            type: 'text',
                          }}
                          sx={{
                            width: 40,
                            borderColor: verificationMessage && !isVerified ? 'red' : 'inherit',
                            borderWidth: verificationMessage && !isVerified ? '1.5px' : '1px',
                            borderStyle: 'solid',
                          }}
                          id={`code-${index}`}
                          disabled={isSubmitting && !isVerified}  
                        />
                      ))
                    }
                  </FieldArray>
                </Box>
                <Typography mt={2} sx={{ textAlign: 'center', color: 'red' }} variant="body2" color="textSecondary">
                  {verificationMessage}
                </Typography>
                 <div className='grid place-items-center '>
                  {
                  STATUS.LOADING === verificationCheck && <CircularProgress sx={{color: 'black'}} size={20} />
                  }
                  </div>
                <Typography mt={2} sx={{ textAlign: 'center' }} variant="body2" color="textSecondary">
                  Time remaining: {formatTime(timeLeft)}
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
}
