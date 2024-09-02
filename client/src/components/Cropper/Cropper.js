import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Slider from '@mui/material/Slider';
import { Button } from '@mui/material';
import getCroppedImg from '../../utils/croppedImage';
import { dataURLtoFile } from '../../utils/dataURLtoFile';
import { useDispatch} from 'react-redux';
import {resetImage, uploadImage } from '../../store/cropedImageSlice';
import { setClose } from '../../store/pictureSlice';
import { fetchUserData } from '../../store/profileSlice';

function CropperComponent({ image , setNewData}) {
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [open , setOpen] = useState(false)
  const dispatch = useDispatch();

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };




  const onUpload = async() => {
    setOpen(true)
    try{
     const canvas = await getCroppedImg(image, croppedArea)
     const canvasDataUrl = canvas.toDataURL('image/jpeg')
     const convertedUrlToFile = dataURLtoFile(canvasDataUrl, 'cropped-image.jpeg')
     const formDataObject = new FormData();
     formDataObject.append('file', convertedUrlToFile);
     
     dispatch(uploadImage(formDataObject))
     .then(()=>{
      setOpen(false)
      dispatch(resetImage())
      dispatch(setClose())
      dispatch(fetchUserData())
     })

    }catch(error){
      console.log(error)
    }
  };


  return (
    <div className='h-dvh w-full bg-black bg-opacity-100'>
      <div className='h-[90%] p-3'>
        {image && (
          <>
            <div className='h-[90%] relative'>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className='h-[10%] p-4 grid place-items-center '>
              <Slider
                min={1}
                max={3}
                sx={{
                  width: {
                    xs: '100%', 
                    sm: '80%',  
                    md: '70%',  
                    lg: '60%',  
                    xl: '50%',  
                  },
                }}
                step={0.1}
                value={zoom}
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </div>
          </>
        )}
      </div>
      <div className='h-[10%] flex items-center justify-center'>
        <Button
          variant='contained'
          color='success'
          onClick={onUpload}
          style={{ marginRight: '10px' }}
        >
          Upload
        </Button>
        <Button variant='contained' color='error' onClick={()=> dispatch()}>
          Cancel
        </Button>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default CropperComponent;
