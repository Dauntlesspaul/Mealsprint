import React from 'react';
import PaulCregImg from '../../assets/images/paul-creg.png';
import CriesLenon from '../../assets/images/cries-lenon.png';
import MichalGun from '../../assets/images/michal-gun.png';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import AishatKareem from '../../assets/images/Aishat-kareem.png';
import Rating from '@mui/material/Rating';

function Testimonies() {
  return (
    <div className='px-3 md:px-10 2xl:px-40 xl:px-24 lg:px-24 lg:my-16'>
      <h1 className='text-white text-xl xl:text-[35px] lg:text-[26px] text-center my-5 font-bold'>What our Customers are Saying</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 place-items-center'>
        <div className='bg-[#191919] rounded-lg h-80 w-full py-6 px-3'>
          <div className='flex items-center'>
            <div className='overflow-hidden h-9 w-9 rounded-full'>
              <img src={PaulCregImg} alt='' className='object-cover w-full h-full'/>
            </div>
            <div className='flex flex-col ml-2'>
              <h2 className='text-white text-sm font-semibold'>Paul Creg</h2>
              <Rating 
                sx={{ fontSize: '13px', marginTop: '2px' }} 
                name="read-only" 
                value={5} 
                readOnly 
              />
            </div>   
          </div> 
          <FormatQuoteIcon sx={{ transform: 'rotate(180deg)', color: 'white', margin: '13px 0' }} />
          <blockquote className='text-[#8d8c8c] text-sm'>
            I can’t get enough of Foodsprint! The quality of the food is consistently excellent, and I love discovering new dishes. The delivery is fast and reliable, and the customer service is always helpful and friendly. It’s the best food delivery service I’ve used by far.
          </blockquote>
          <FormatQuoteIcon sx={{ float: 'right', color: 'white', marginTop: '13px' }} />
        </div>

        <div className='bg-[#191919] rounded-lg h-80 w-full py-6 px-3'>
          <div className='flex items-center'>
            <div className='overflow-hidden h-9 w-9 rounded-full'>
              <img src={CriesLenon} alt='' className='object-cover w-full h-full'/>
            </div>
            <div className='flex flex-col ml-2'>
              <h2 className='text-white text-sm font-semibold'>Cries Lenon</h2>
              <Rating 
                sx={{ fontSize: '13px', marginTop: '2px' }} 
                name="read-only" 
                value={5} 
                readOnly 
              />
            </div>   
          </div> 
          <FormatQuoteIcon sx={{ transform: 'rotate(180deg)', color: 'white', margin: '13px 0' }} />
          <blockquote className='text-[#8d8c8c] text-sm'>
            Foodsprint has completely transformed my dining experience! The food always arrives on time, hot, and fresh. The variety on the menu is impressive, catering to all my cravings. Plus, the interface is super user-friendly, making ordering a breeze. Highly recommend!
          </blockquote>
          <FormatQuoteIcon sx={{ float: 'right', color: 'white', marginTop: '13px' }} />
        </div>

        <div className='bg-[#191919] rounded-lg h-80 w-full py-6 px-3'>
          <div className='flex items-center'>
            <div className='overflow-hidden h-9 w-9 rounded-full'>
              <img src={MichalGun} alt='' className='object-cover w-full h-full'/>
            </div>
            <div className='flex flex-col ml-2'>
              <h2 className='text-white text-sm font-semibold'>Michal Gun</h2>
              <Rating 
                sx={{ fontSize: '13px', marginTop: '2px' }} 
                name="read-only" 
                value={5} 
                readOnly 
              />
            </div>   
          </div> 
          <FormatQuoteIcon sx={{ transform: 'rotate(180deg)', color: 'white', margin: '13px 0' }} />
          <blockquote className='text-[#8d8c8c] text-sm'>
            I've never been so satisfied with a food delivery service before. Mealsprint's meals are delicious, made from fresh ingredients, and there are plenty of options to choose from. The delivery is prompt, and the website is easy to use. Plus, the deals and discounts are fantastic. This service is a game-changer!
          </blockquote>
          <FormatQuoteIcon sx={{ float: 'right', color: 'white', marginTop: '13px' }} />
        </div>

        <div className='bg-[#191919] rounded-lg h-80 w-full py-6 px-3'>
          <div className='flex items-center'>
            <div className='overflow-hidden h-9 w-9 rounded-full'>
              <img src={AishatKareem} alt='' className='object-cover w-full h-full'/>
            </div>
            <div className='flex flex-col ml-2'>
              <h2 className='text-white text-sm font-semibold'>Aishat Kareem</h2>
              <Rating 
                sx={{ fontSize: '13px', marginTop: '2px' }} 
                name="read-only" 
                value={5} 
                readOnly 
              />
            </div>   
          </div> 
          <FormatQuoteIcon sx={{ transform: 'rotate(180deg)', color: 'white', margin: '13px 0' }} />
          <blockquote className='text-[#8d8c8c] text-sm'>
            What sets Mealsprint apart is the attention to detail. The food is not only tasty but also well-packaged, ensuring it arrives in perfect condition. The delivery time is quick, and the website itself is intuitive. The regular promotions make it even better. I couldn’t be happier with the service!
          </blockquote>
          <FormatQuoteIcon sx={{ float: 'right', color: 'white', marginTop: '13px' }} />
        </div>
      </div>
    </div>
  );
}

export default Testimonies;
