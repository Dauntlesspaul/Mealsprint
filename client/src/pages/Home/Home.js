// Home.js
import React, { useEffect } from 'react';
import './Home.scss';
import bg from '../../assets/images/Background.png';
import icon from '../../assets/images/icon.png';
import Menu from '../../components/svgs/svg.js';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, IconButton } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js';
import Sidebar from '../../components/SideBar/Sidebar.js';
import IntroImg from '../../assets/images/chef.png';
import Testimonies from '../../components/Testimonies/Testimonies.js';
import Subscribe from '../../components/Subscribe/Subscribe.js';
import { getIntroProducts, introProductsFetch } from '../../store/introProducts.js';
import MenuSection from '../../components/MenuSection/MenuSection.js';
import { getCartStatus } from '../../store/cartSlice.js';
import { useNavigate } from 'react-router-dom';
import { setOrderOff, setOrderOn } from '../../store/orderSlice.js';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { STATUS } from '../../utils/status.js';
import Loading from '../../components/Loading/Loading.js';
import { getUserData } from '../../store/profileSlice.js';
import OrderSlide from '../../components/OrderSlide/OrderSlide.js';
import ScrollToTop from '../../components/Scroll/Button.js';

function Home() {
    const dispatch = useDispatch();
    const foodItem = useSelector(getIntroProducts);
    const navigate = useNavigate()
    const isLoading = useSelector(getUserData)
    useEffect(() => {
        dispatch(introProductsFetch('all'));
    }, [dispatch]);

    useEffect(()=>{
        dispatch(setSidebarOff())
        dispatch(setOrderOff())
      }, [dispatch])
    const cartItem = useSelector(getCartStatus)

    if(STATUS.LOADING === isLoading){
        return <Loading />
    }
    return (
        <div className='min-h-screen bg-[#0D0D0D]'>
            <OrderSlide />
            <ScrollToTop/>
            <Sidebar />
            <div className="relative h-[543px] 2xl:h-[818px]">
                <img src={bg} alt="" className="w-full h-full object-cover object-bottom" />
                <div className="absolute top-0 left-0 w-full h-full mt-7 px-4 2xl:px-40 xl:px-24 md:px-10">
                    <div className='md:hidden grid place-items-center w-full'>
                        <img src={icon} alt='' className='h-16 w-auto aspect-auto' />
                    </div>
                    <div className='md:hidden flex justify-between w-full items-center my-4'>
                        <IconButton
                            sx={{
                                marginLeft: '-12px',
                            }}
                            onClick={() => { dispatch(setSidebarOn()) }}
                        >
                            <Menu />
                        </IconButton>
                        <div onClick={()=>dispatch(setOrderOn())} className='relative cursor-pointer'>
                            <ShoppingCartIcon sx={{ color: 'white', fontSize: '35px' }} />
                            <div className='w-3 h-3 rounded-full bg-red-700 text-white flex items-center justify-center absolute top-0 right-0 text-[10px]'>{cartItem.length}</div>
                        </div>
                    </div>
                    <div className='xl:w-[600px]'>
                        <h1 className="text-white text-4xl md:text-5xl 2xl:text-[66px] leading-[43px] 2xl:leading-[96px] mt-10 font-bold">
                            Welcome! <br /> We Made Delicious <br /> Food For You
                        </h1>
                        <h2 className='text-white font-normal mt-4 2xl:text-[20px]'>
                        Whether you're craving a hearty burger, a crispy chicken shawarma wrap, or a sweet, delectable donut, we've got it all freshly made and delivered right to your doorstep.
                        </h2>
                    </div>
                    <div className='flex justify-center md:justify-start'>
                        <Button
                            sx={{
                                backgroundColor: 'orange',
                                color: 'white',
                                padding: '11px 25px',
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
                            <> <span>Order Online</span><ArrowCircleRightIcon /></>
                        </Button>
                    </div>
                </div>
            </div>
            <section className='px-3 md:px-10 xl:px-24 2xl:px-40 '>
                <h2 className='text-white text-xl xl:text-[35px] lg:text-[26px] text-center my-5 font-bold'>Why we are the best food maker</h2>
                <div className='md:flex md:gap-5 md:flex-row-reverse xl:mt-10'>
                    <div className='flex justify-center md:flex-grow md:w-1/2'>
                        <div className='overflow-hidden max-w-[600px] w-full h-auto md:h-fit'>
                            <img src={IntroImg} alt='intro img' className='w-full h-full aspect-auto' />
                        </div>
                    </div>
                    <div className='md:flex-grow md:w-1/2 items-center'>
                        <h3 className='text-white font-semibold'>About Us</h3>
                        <p className='text-[#8d8c8c] text-sm md:text-base xl:text-lg'>
                            We pride ourselves on using the freshest, highest quality ingredients to ensure every bite is flavorful and nutritious. Our expert chefs meticulously craft each dish, offering a diverse menu that caters to all tastes, from classic comfort foods to exotic international cuisines. With an efficient delivery system, your meal arrives hot and fresh at your doorstep in no time. We prioritize your satisfaction with friendly customer service and uphold the highest hygiene and safety standards in meal preparation and packaging. Our commitment to quality extends to competitive pricing, great deals, and regular discounts, providing exceptional value for your money. Additionally, we prioritize sustainability by sourcing local ingredients and using eco-friendly packaging, reflecting our dedication to delivering an outstanding dining experience and making us the best choice for your food delivery needs.
                        </p>
                    </div>
                </div>
            </section>
             <MenuSection foodItem={foodItem}/>
            <section className='px-3 md:grid md:place-items-center'>
                <h2 className='text-white text-xl text-center xl:text-[35px] lg:text-[26px] my-5 font-bold'>We believe in making quality foods</h2>
                <div className='md:flex md:justify-between md:w-3/4 lg:w-2/4 2xl:w-2/4'>
                    <div className='grid place-items-center'>
                        <h2 className='text-white text-[46px] font-bold'>1M+</h2>
                        <p className='text-[#8d8c8c] text-sm'>Happy Customers</p>
                    </div>
                    <div className='grid place-items-center'>
                        <h2 className='text-white text-[46px] font-bold'>98%</h2>
                        <p className='text-[#8d8c8c] text-sm'>Customer Satisfaction</p>
                    </div>
                    <div className='grid place-items-center'>
                        <h2 className='text-white text-[46px] font-bold'>20+</h2>
                        <p className='text-[#8d8c8c] text-sm'>Our Branches</p>
                    </div>
                    <div className='grid place-items-center'>
                        <h2 className='text-white text-[46px] font-bold'>10k+</h2>
                        <p className='text-[#8d8c8c] text-sm'>Total Employees</p>
                    </div>
                </div>
            </section>
            <Testimonies />
            <Subscribe />
        </div>
    );
}

export default Home;
