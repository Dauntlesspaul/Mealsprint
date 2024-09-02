import React from 'react'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function HomeSkeleton() {
  return (
    Array(8).fill(0).map((_, idx)=>(
    <div key={idx} className='bg-[#191919] h-[350px] rounded-md xl:w-[360px]  lg:w-[350px] 2xl:w-[380px] '>
          <Skeleton className='w-full h-full'/>
    </div>
    ))
  )
}

export default HomeSkeleton