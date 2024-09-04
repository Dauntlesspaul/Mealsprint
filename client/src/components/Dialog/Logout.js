import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../store/logoutSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/loginSlice';
import { resetLoggedIn } from '../../store/profileSlice';
import { resetGoogleAuth } from '../../store/googleSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
 const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () =>{
    dispatch(logout())
    dispatch(resetLoggedIn())
    dispatch(resetGoogleAuth())
    dispatch(userLogout())
    .then(() => {
        navigate('/login');
      });
  }

  return (
    <React.Fragment>
      <Button 
           sx={{
            width: '100%',
            backgroundColor: 'white',
            padding: '0px 12px',
            height: '48px',
            fontFamily: 'inherit',
            fontWeight: '400',
            fontSize: '16px',
            lineHeight: '24px',
            borderRadius: 0,
            color:'black',
            display: 'flex',
            borderTop: '1px solid #e0e0e0',
            alignItems: 'center',
            borderColor: '#e0e0e0',
            justifyContent: 'space-between',
            textTransform: 'none',
            "&:hover":{
              backgroundColor: 'red',
              color: 'white',
              ".MuiSvgIcon-root": {
                color: 'white',
              }
            }
           }}
           onClick={handleClickOpen}
          >
            <span>Logout</span> <ArrowRightIcon sx={{ color: 'orange' }} />
          </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
             Are you sure you want to log out? You will need to log in again to continue using your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{color: 'black', fontWeight: '600'}} onClick={handleClose}>Cancel</Button>
          <Button sx={{color: 'black',  fontWeight: '600'}} onClick={handleLogout}>Logout</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
