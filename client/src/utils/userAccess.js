import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {  fetchUserData, getUserLogInStatus,} from '../store/profileSlice';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(fetchUserData())
  }, [dispatch])

  const loggedIn = useSelector(getUserLogInStatus);
 console.log(loggedIn)
  if (loggedIn) {
    return <Navigate to="/user" />;
  }

  return children;
};

export default ProtectedRoute;
