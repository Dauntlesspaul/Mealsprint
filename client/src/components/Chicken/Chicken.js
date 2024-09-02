import React, {useEffect} from 'react'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { allProductsFetch, getAllProducts } from '../../store/allproductsSlice';
import { useDispatch, useSelector } from 'react-redux';
import {IconButton } from '@mui/material';
import { setDialogOpen} from '../../store/dialogSlice';
function Chicken() {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(allProductsFetch())
      }, [dispatch])
      const foodItems = useSelector(getAllProducts)
      const isChicken = foodItems.filter(item=> item.category === 'chicken')
  return (  
        <div>
            <div className='text-white text-lg md:text-xl xl:text-2xl mb-2 font-semibold'>Chicken Dishes</div>
            <div className='max-w-[1200px] xl:w-full xl:grid-cols-2 lg:w-[700px] md:gap-5 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 md:max-w-[880px] xl:max-w-[880px] md:grid-cols-2 lg:max-w-[500px] lg:grid-cols-1 gap-6'>
                {
                isChicken && isChicken.map((item, idx) => {
                    return (
                    <div key={idx} className='bg-[#191919] rounded-md p-3 w-full'>
                        <div className='w-full h-52 rounded-md overflow-hidden'>
                        <img src={item.imageurl} alt='' className='w-full hover:scale-150 transition-all duration-100 h-full object-cover object-center' />
                        </div>
                        <div className='w-full h-36 py-3 relative'>
                        <h2 className='text-white'>{item.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
                        <h3 className='text-sm text-[#8d8c8c]'>{item.description}</h3>
                        <div className='absolute bottom-0 w-full flex items-center justify-between'>
                            <span className='text-white font-medium'>£{Number(item.price).toFixed(2)}</span>
                            <IconButton onClick={()=> dispatch(setDialogOpen(item))}>
                            <AddCircleOutlineOutlinedIcon  sx={{ color: "orange", fontSize: '30px' }} />
                            </IconButton>
                        </div>
                        </div>
                    </div>
            )})
                }
            </div> 
        </div>
  )
}

export default Chicken