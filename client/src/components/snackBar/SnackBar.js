import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function CustomizedSnackbars({content, severity}) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  
  React.useEffect(()=>{
    if(content){
      handleClick()
    }
  }, [content])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {content}
        </Alert>
      </Snackbar>
    </div>
  );
}
