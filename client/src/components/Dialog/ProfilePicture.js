import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { setClose } from '../../store/pictureSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../store/profileSlice';
import { setImage } from '../../store/cropedImageSlice';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs({ open, close }) {
 
 const dispatch = useDispatch();
 const userData = useSelector(getUserData);
 const handleChange = (event)=>{
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      dispatch(setImage(e.target.result));
    };
    reader.readAsDataURL(file);
  }
}
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={close}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          sx: {
            width: { xs: '85%', sm: '410px' },
            maxWidth: '420px', 
            margin: 'auto',
          },
        }}
      >
        <DialogTitle sx={{ m: 0,ml:1, p: 1 }} id="customized-dialog-title">
          Profile Picture
        </DialogTitle>
        
        <DialogContent
          sx={{
            width: '100%',
            height: 'auto',
            fontFamily: 'Arial, sans-serif',
          }}
          dividers
        >
          <div className='h-full w-full grid overflow-hidden place-items-center md:min-h-80 min-h-[286px] '> 
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
                    <div className='h-full w-full bg-[orange] grid  place-items-center md:min-h-80 min-h-[286px]'>
                    <h2 className='text-white text-8xl'>{userData.firstname.charAt(0)}</h2>
                    </div>
                  )}
            </div>
        </DialogContent>
        <DialogActions
         sx={{
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
         }}
           >
          <Button  
           onClick={()=> dispatch(setClose())}
          sx={{
              marginLeft: '3px',
              color: 'black',
              fontWeight: 600,
          }}>
           Cancel
          </Button>

          <Button
            sx={{
              color: 'black',
              marginLeft: '3px',
              fontWeight: 600,
            }}
          >
            <label htmlFor="file-upload" style={{ cursor: 'pointer', margin: 0 }}>
              Edit
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleChange}
            />
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
