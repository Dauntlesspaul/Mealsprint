import React from 'react'
import './Loading.scss'

function Loading() {
  return (
    <div className='fixed h-screen w-screen bg-white z-[999] grid place-items-center top-0'>
        <div className='loader'> </div>
    </div>
  )
}

export default Loading