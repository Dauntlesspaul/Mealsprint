import React, { useMemo } from 'react';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import './MenuSection.scss';
import Dialog from '../Dialog/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getDialogStatus, setDialogClose, setDialogOpen } from '../../store/dialogSlice';
import { Button, IconButton } from '@mui/material';
import { getIntroProductsFetchStatus, introProductsFetch } from '../../store/introProducts';
import HomeSkeleton from '../Skeleton/HomeSKeleton';
import { useNavigate } from 'react-router-dom';

function MenuSection({ foodItem }) {
    const isDialogOpen = useSelector(getDialogStatus);
    const status = useSelector(getIntroProductsFetchStatus)
    const dispatch = useDispatch();
    const navigate = useNavigate()
 const allProducts = foodItem.every(item => item.section === 'home');
    const slug = useMemo(() => {
        if (foodItem.length > 0 && allProducts) {
            return 'all'
        }
          return foodItem[0] && foodItem[0].category;
    }, [foodItem, allProducts]);

    return (
        <div className='grid place-content-center lg:my-16'>
            <h2 className='text-white text-xl text-center xl:text-[35px] lg:text-[26px] md:my-5 mb-1 mt-5 font-bold'>
                Our Best and Delicious Menu
            </h2>
            <div className='px-6 md:px-10 2xl:px-44 place-self-center w-full overflow-hidden'>
                <div className='overflow-x-scroll scrollbar-hide'>
                    <ul className='text-white flex md:justify-between md:text-lg font-semibold whitespace-nowrap space-x-3 mb-2'>
                        <button className='hover:text-gray-700 w-fit' onClick={() => dispatch(introProductsFetch('all'))}>
                            All {slug === 'all' && <hr className='border-none h-1 bg-[orange]' />}
                        </button>
                        <button className='hover:text-gray-700 w-fit' onClick={() => dispatch(introProductsFetch('burger'))}>
                            Burgers {slug === 'burger' && <hr className='border-none h-1 bg-[orange]' />}
                        </button>
                        <button className='hover:text-gray-700 w-fit' onClick={() => dispatch(introProductsFetch('chicken'))}>
                            Chicken Dishes {slug === 'chicken' && <hr className='border-none h-1 bg-[orange]' />}
                        </button>
                        <button className='hover:text-gray-700 w-fit' onClick={() => dispatch(introProductsFetch('meat'))}>
                            Meat Dishes {slug === 'meat' && <hr className='border-none h-1 bg-[orange]' />}
                        </button>
                        <button className='hover:text-gray-700 w-fit' onClick={() => dispatch(introProductsFetch('cakes'))}>
                            Cakes {slug === 'cakes' && <hr className='border-none h-1 bg-[orange]' />}
                        </button>
                        <button className='hover:text-gray-700 w-fit' onClick={() => dispatch(introProductsFetch('wrap'))}>
                            Wraps {slug === 'wrap' && <hr className='border-none h-1 bg-[orange]' />}
                        </button>
                        <button className='hover:text-gray-700 w-fit' onClick={() => dispatch(introProductsFetch('others'))}>
                            Side Dishes {slug === 'others' && <hr className='border-none h-1 bg-[orange]' />}
                        </button>
                    </ul>
                </div>
            </div>
            <div className='px-6 md:px-10 2xl:px-40'>
                <div className='max-w-[1200px] 2xl:max-w-max md:gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {status === 'LOADING' ? 
                    <HomeSkeleton /> 
                    : 
                    foodItem.map((item, idx) => (
                        <div key={idx} className='bg-[#191919] rounded-md p-3 w-full'>
                            <div className='w-full h-52 rounded-md overflow-hidden'>
                                <img src={item.imageurl} alt='' className='w-full hover:scale-150 transition-all duration-100 h-full object-cover object-center' />
                            </div>
                            <div className='w-full h-36 py-3 relative'>
                                <h2 className='text-white'>
                                    {item.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </h2>
                                <h3 className='text-sm text-[#8d8c8c]'>{item.description}</h3>
                                <div className='absolute bottom-0 w-full flex items-center justify-between'>
                                    <span className='text-white font-medium'>£{Number(item.price).toFixed(2)}</span>
                                    <IconButton onClick={() => dispatch(setDialogOpen(item))}>
                                        <AddCircleOutlineOutlinedIcon sx={{ color: "orange", fontSize: '30px' }} />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    ))
                    }
                </div>
                </div>
                {status === "SUCCESS" && 
                <div className='w-full  md:mt-4 flex justify-center'>
                  <Button
                    sx={{
                        backgroundColor: 'orange',
                        color: 'white',
                        padding: '7px 27px',
                        borderRadius: '30px',
                        '&:hover': {
                            backgroundColor: 'orange'
                        },
                        textTransform: 'none',
                        fontWeight: '700',
                        marginTop: '35px'
                    }}
                    onClick={()=> navigate('/menu')}
                >
                   <span>See More</span>
                </Button>
                </div> 
                    }
            <Dialog open={isDialogOpen} close={() => dispatch(setDialogClose())} />
        </div>
    );
}

export default MenuSection;
