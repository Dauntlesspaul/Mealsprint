import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { getContentStatus } from '../../store/dialogSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { decrement, getCount, increment, reset } from '../../store/quantitySlice';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useLocalStorage } from '../../hooks/useLocalStorageHook';
import { useEffect } from 'react';
import { addToCart, getCartStatus } from '../../store/cartSlice';
import { getNotificationStatus, notificationOff, notificationOn } from '../../store/notificationSlice';
import CustomizedSnackbars from '../snackBar/SnackBar';
import ButtonClickSound from '../../assets/audio/button-sound.mp3';
import AddtoCartSound from '../../assets/audio/success.mp3';
import useSound from '../../hooks/useSoundHook';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs({ open, close }) {
  const content = useSelector(getContentStatus);
  const dispatch = useDispatch()
  const count = useSelector(getCount);
  const notification = useSelector(getNotificationStatus);

   const playSound = useSound(ButtonClickSound, 0.009)
   const cartSound = useSound(AddtoCartSound, 0.1)

  const handleClose = () =>{
    close()
    dispatch(reset())
  }

  useEffect(()=>{
    if(notification){
      let timer = setTimeout(()=>{
        dispatch(notificationOff())
      }, 3000)

      return ()=> clearTimeout(timer)
    }
  }, [dispatch, notification])

  const [cart, setCart] = useLocalStorage('cart', [])
  const cartItems = useSelector(getCartStatus)

  useEffect(()=>{
    dispatch(addToCart(cart))
  }, [dispatch, cart])

  const handleCartUpdate = () => {
    const newItem = {
      image: content.imageurl,
      name: content.name,
      description: content.description,
      units: count,
      price: content.price
    };
  
    const existingItemIndex = cartItems.findIndex(item => item.name === newItem.name);
  
    let updatedCart;
  
    if (existingItemIndex !== -1) {
      updatedCart = cartItems.map((item, index) =>
        index === existingItemIndex ? newItem : item
      );
    } else {
      updatedCart = [...cartItems, newItem];
    }
  
    
    dispatch(addToCart(updatedCart));
    setCart(updatedCart);
    dispatch(notificationOn())
    cartSound();
    dispatch(reset());
    close();

  };

  const handleIncrease = () =>{
    dispatch(increment())
    playSound()
  }

  const handleDecrease = () =>{
    if(count > 1){
    dispatch(decrement())
    playSound()
    }
  }
  

  return (<>
    { notification &&
      <CustomizedSnackbars content='New item added to cart' severity='success' />
    }
    <React.Fragment>
      <BootstrapDialog
        onClose={close}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          sx: {
            width: { xs: '85%', sm: '450px' },
            maxWidth: '450px', 
            margin: 'auto',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 1 }} id="customized-dialog-title">
          {content.name &&
            content.name
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CancelOutlinedIcon
           sx={{ 
            color: 'orange', 
            '&:hover': {
              color: 'orange'
              }
              }} />
        </IconButton>
        <DialogContent
          sx={{
            backgroundColor: '#191919',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
          dividers
        >
          <div className="w-full h-52 rounded-md overflow-hidden">
            {content.imageurl && (
              <img
                src={content.imageurl}
                alt=""
                className="w-full  h-full object-cover object-center"
              />
            )}
          </div>
          <div className="pt-2">
            <Typography variant="body2" sx={{color: '#8d8c8c', textAlign: 'start'}}>
              {content.description}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions
         sx={{
           justifyContent: 'space-between',

         }}
           >
          <div className='flex items-center'>
            <AddShoppingCartIcon />
            <span className='ml-1 flex border  items-center w-16  divide-x-[1px] d justify-between pl-2'>
              <span className='ml-[4px]'>{count}</span>
            <div className='flex flex-col justify-center '>
              <ArrowDropUpOutlinedIcon sx={{cursor: 'pointer', marginBottom: '-5px'}} onClick={handleIncrease} />
              <ArrowDropDownOutlinedIcon  sx={{cursor: 'pointer'}} onClick={handleDecrease}/>
            </div>
            </span>
          </div>  
          <Button  
          variant='contained' 
          sx={{
            backgroundColor: 'orange',
              textTransform: 'none',
            '&:hover':{
              backgroundColor: 'orange',
            }
          }}
          onClick={handleCartUpdate}>
            ₤ ({(Number(content.price) * count).toFixed(2)}) add <AddOutlinedIcon sx={{fontSize: '13px'}} />
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
    </>);
}
