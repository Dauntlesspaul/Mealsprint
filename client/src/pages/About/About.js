import React, { useEffect } from 'react';
import './About.scss';
import bg from '../../assets/images/Background.png';
import icon from '../../assets/images/icon.png';
import Menu from '../../components/svgs/svg.js';
import { Button, IconButton } from '@mui/material';
import Sidebar from '../../components/SideBar/Sidebar.js';
import OrderSlide from '../../components/OrderSlide/OrderSlide.js';
import ScrollToTop from '../../components/Scroll/Button.js';
import IntroImg from '../../assets/images/chef.png';
import { useDispatch } from 'react-redux';
import { setSidebarOff, setSidebarOn } from '../../store/sliderSlice.js';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useNavigate } from 'react-router-dom';
import { setOrderOff } from '../../store/orderSlice.js';

function About() {
 const dispatch = useDispatch()
 const navigate = useNavigate()

 useEffect(()=>{
  dispatch(setSidebarOff())
  dispatch(setOrderOff())
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = bg;
  document.head.appendChild(link);
}, [dispatch])

  return (
    <div className='min-h-screen bg-[#0D0D0D] pb-10'>
      <ScrollToTop/>
      <Sidebar />
      <OrderSlide />
      <div className="relative h-[300px]">
        <img src={bg} alt="" className="w-full h-full object-cover object-bottom" />
        <div className="absolute top-0 left-0 w-full h-full mt-7 px-3 xl:px-40 md:px-10">
          <div className='md:hidden grid place-items-center w-full'>
            <img onClick={()=>navigate('/')} src={icon} alt='' className='h-16 w-auto aspect-auto' />
          </div>
          <div className='md:hidden flex justify-between w-full items-center my-4'>
            <IconButton
              sx={{ marginLeft: '-12px' }}
              onClick={() => { dispatch(setSidebarOn()) }}
            >
              <Menu />
            </IconButton>
            <Button
              sx={{
              backgroundColor: 'orange',
              padding: '6px 20px',
              marginTop: '-5px',
              color: 'black',
              fontWeight: '700',
              borderRadius: '35px',
              fontSize: '14px',
              lineHeight: '1.0',
              '&:hover': {
                backgroundColor: 'orange'
              },
              textTransform: 'none',
              minHeight: 'auto',
              minWidth: 'auto'
            }}
            onClick={()=> navigate('/signup')}
            >
              { <><span className='text-white'>Signup</span> <ArrowCircleRightIcon sx={{color: 'white'}} /></>}
            </Button>
          </div>
          <div className=' w-full'>
              <h1 className="text-white text-center text-3xl md:text-4xl md:mt-20 leading-[43px] mt-9 font-bold">About Us</h1>
          </div>
        </div>
      </div>
      <div className='px-3  2xl:px-40 xl:px-24 md:px-10 pb-5 z-30 md:w-fit w-full'>
            <section className='px-3 md:px-10 xl:px-24 2xl:px-40 '>
                <h2 className='text-white text-xl xl:text-[35px] lg:text-[26px] text-center my-5 font-bold'>Why we are the best food maker</h2>
                <div className='md:flex md:gap-5 md:flex-row-reverse xl:mt-10'>
                    <div className='flex justify-center md:flex-grow md:w-1/2'>
                        <div className='overflow-hidden max-w-[600px] w-full h-auto md:h-fit'>
                            <img src={IntroImg} alt='intro img' className='w-full h-full aspect-auto' />
                        </div>
                    </div>
                    <div className='md:flex-grow md:w-1/2 items-center'>
                        <p className='text-[#8d8c8c] text-sm md:text-base xl:text-lg'>
                            We pride ourselves on using the freshest, highest quality ingredients to ensure every bite is flavorful and nutritious. Our expert chefs meticulously craft each dish, offering a diverse menu that caters to all tastes, from classic comfort foods to exotic international cuisines. With an efficient delivery system, your meal arrives hot and fresh at your doorstep in no time. We prioritize your satisfaction with friendly customer service and uphold the highest hygiene and safety standards in meal preparation and packaging. Our commitment to quality extends to competitive pricing, great deals, and regular discounts, providing exceptional value for your money. Additionally, we prioritize sustainability by sourcing local ingredients and using eco-friendly packaging, reflecting our dedication to delivering an outstanding dining experience and making us the best choice for your food delivery needs.
                        </p>
                    </div>
                </div>
            </section>
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
       </div>
    </div>
  );
}

export default About;
