import React from 'react'
import AE from '../../assets/images/american-express.png';
import MasterCard from '../../assets/images/Mastercard.png';
import Visa from '../../assets/images/Visa.png';
import Fb from '../../assets/images/facebook.png';
import Tw from '../../assets/images/twitter.png';
import Ds from '../../assets/images/discord.png';
import Ld from '../../assets/images/linkedin.png';
import CopyrightOutlinedIcon from '@mui/icons-material/CopyrightOutlined';

function Footer() {
  return (
    <div className='bg-[#191919] pt-12 pb-4 px-3'>
      <div className='md:flex md:justify-between px-3 md:px-10 xl:px-40'>
        <div className='space-y-1'>
            <h2 className='text-white font-semibold'>Our Products</h2>
             <h3 className='text-[#8d8c8c] text-sm'>Our Burgers</h3>
             <h3 className='text-[#8d8c8c] text-sm'>Our Cakes</h3>
             <h3 className='text-[#8d8c8c] text-sm'>Our Fish Dishes</h3>
             <h3 className='text-[#8d8c8c] text-sm'>Our Chicken Dishes</h3>
             <h3 className='text-[#8d8c8c] text-sm'>Our Meat Dishes</h3>
        </div>
        <div className='space-y-1'>
            <h2 className='text-white font-semibold'>Legal Information</h2>
             <h3 className='text-[#8d8c8c] text-sm'>Legal Notice</h3>
        </div>
        <div className='space-y-1'>
            <h2 className='text-white font-semibold'>Our Products</h2>
             <h3 className='text-[#8d8c8c] text-sm'>Contacts</h3>
             <h3 className='text-[#8d8c8c] text-sm'>Our Addresses</h3>
             <h3 className='text-[#8d8c8c] text-sm'>Become a Time Square Franchisee</h3>
        </div> 
        <div className='space-y-1'>
            <h2 className='text-white font-semibold'>We Accept</h2>
            <div className='flex flex-wrap space-x-2'>
              <img className='w-11 h-auto' src={MasterCard} alt='' />
              <img className='w-11 h-auto' src={Visa} alt='' />
              <img className='w-11 h-auto' src={AE} alt='' />
            </div>
        </div>
    </div>   
        <hr className='border-none h-[1px] bg-[#4F4F4F] mt-6'/>
         <div className='md:flex md:items-center md:justify-between px-3 md:px-10 xl:px-40'>
          <div className='grid place-items-center md:place-items-start my-5 w-full'>
            <div className='flex space-x-3 w-fit'>
              <img src={Fb} className='h-6 w-auto ' alt='' />
              <img src={Tw} className='h-6 w-auto ' alt='' />
              <img src={Ds} className='h-6 w-auto ' alt='' />
              <img src={Ld} className='h-6 w-auto ' alt='' />
            </div>
          </div>
          <span className='flex space-x-1 justify-center md:justify-end w-full'><CopyrightOutlinedIcon sx={{color: 'white', fontSize: '15px'}}/> <h2 className='text-white text-xs'>2024 Meal Sprint, All rights reserved.</h2></span>
        </div>
    </div>
  )
}

export default Footer