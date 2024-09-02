import React from 'react'
import './SideBar.scss'
import { useSelector, useDispatch } from 'react-redux'
import { getSideBarStatus } from '../../store/sliderSlice'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Link, useLocation } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { setSidebarOff } from '../../store/sliderSlice';
import { getUserData } from '../../store/profileSlice';
import AccountCircle from '@mui/icons-material/AccountCircle';
function Sidebar() {
  const isSidebarOn = useSelector(getSideBarStatus)
  const dispatch = useDispatch()
  const location = useLocation()
  const currentPath = location.pathname;
  const userData = useSelector(getUserData)
  
  return (
    <div className={`${isSidebarOn ? "side-bar-on" : "side-bar-off"}`}>
      <nav className='flex flex-col py-4 px-2 space-y-[8px] relative'>
        <IconButton
          aria-label="close"
          sx={{
            position: 'absolute',
            top: '2px',
            right: '10px',
            color: 'white'
        }}
        onClick={()=> dispatch(setSidebarOff())}
        >
          <CancelOutlinedIcon
           sx={{ 
            color: 'orange', 
            '&:hover': {
              color: 'orange'
              }
              }} />
        </IconButton>
        <span className='text-white w-fit'><Link to='/'>Home</Link> {currentPath === '/' &&  <hr className='border-none h-1 bg-[orange]' />}</span>
        <span className='text-white w-fit '><Link to='/menu'>Menu</Link> {currentPath === '/menu' &&  <hr className='border-none h-1 bg-[orange]' />}</span>
        <span className='text-white w-fit'><Link to='/about'>About Us</Link>{currentPath === '/about' &&  <hr className='border-none h-1 bg-[orange]' />}</span>
        <span className='text-white '>Contact</span>
        {userData.firstname ?
         (<Link to='/user'>
         <div className='flex items-center'>
           <AccountCircle sx={{color: 'white', mr:1,}}/>
           <h1 className='text-white text-base'>Welcome, {userData.firstname}</h1>
         </div>
       </Link>)
        : (
        <span className='text-white '><Link to='/signup'>Become a Member</Link></span>)
          }
      </nav>
    </div>
  )
}

export default Sidebar