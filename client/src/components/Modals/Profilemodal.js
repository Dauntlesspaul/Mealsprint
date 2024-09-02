import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getEditStaus, profileEdit } from '../../store/profileEditSlice';
import { STATUS } from '../../utils/status';
import { CircularProgress } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  width: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const validationSchema = Yup.object({
  firstname: Yup.string().required('First Name is required'),
  lastname: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9+]+$/, 'Phone number must be a number')
    .nullable(),
});

export default function BasicModal({ userData }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const status = useSelector(getEditStaus);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (STATUS.SUCCESS === status) {
      handleClose();
    }
  }, [status]);

  return (
    <div>
      <Button
        sx={{
          textTransform: 'none',
          backgroundColor: 'green',
          color: 'white',
          '&:hover': {
            backgroundColor: 'green',
          },
        }}
        onClick={handleOpen}
      >
        Edit
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Formik
            initialValues={{
              firstname: userData.firstname || '',
              lastname: userData.lastname || '',
              email: userData.email || '',
              phone: userData.phone || '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              dispatch(profileEdit(values));
            }}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Account Information
                </Typography>
                <Field name="firstname">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      sx={{ my: 1.2 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstname}
                      error={touched.firstname && Boolean(errors.firstname)}
                      helperText={touched.firstname && errors.firstname}
                    />
                  )}
                </Field>
                <Field name="lastname">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      sx={{ my: 1.2 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastname}
                      error={touched.lastname && Boolean(errors.lastname)}
                      helperText={touched.lastname && errors.lastname}
                    />
                  )}
                </Field>
                <Field name="email">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      sx={{ my: 1.2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                      value={values.email}
                    />
                  )}
                </Field>
                <Field name="phone">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Phone"
                      variant="outlined"
                      fullWidth
                      sx={{ my: 1.2 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  )}
                </Field>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    sx={{
                      textTransform: 'none',
                      backgroundColor: 'black',
                      borderRadius: '30px',
                      height: '43px',
                      width: '100%',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'black',
                        color: 'white',
                      },
                    }}
                  >
                    {status === STATUS.LOADING ? (
                      <CircularProgress sx={{color: 'white'}} size={20} />
                    ) : (
                      <span>Save</span>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
}
