import React from 'react'
import './App.scss';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import { Provider } from 'react-redux';
import store from './store/store';
import Footer from './components/Footer/Footer';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Menus from './pages/Menu/Menu';
import Post from './pages/Post'
import { SkeletonTheme } from 'react-loading-skeleton';
import Profile from './pages/Profile/Profile';
import Addresses from './pages/Addresses/Addresses';
import Orders from './pages/Orders/Orders';
import Header from './components/Header/Header';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Checkout from './pages/Checkout/Checkout';
import About from './pages/About/About';
import SuccessPage from './pages/Success/Success';
import Delivery from './pages/Delivery/Delivery';
import ErrorPage from './pages/Error/Error';
import ScrollPageToTop from './components/Scroll/PageScroll';
function App() {
  const client_id = process.env.REACT_APP_CLIENT_ID;
  return (
    <div className="App">
      <SkeletonTheme baseColor='#313131' highlightColor='#525252'>
      <GoogleOAuthProvider clientId={client_id}>
      <Provider store={store}>
      <BrowserRouter>
      <ScrollPageToTop>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/menu' element={<Menus/>} />
        <Route path='/post' element={<Post />} />
        <Route path='/user' element={<Profile/>} />
        <Route path='/user/address' element={<Addresses/>} />
        <Route path='/user/orders' element={<Orders/>} />
        <Route path='/order/checkout' element={<Checkout />} />
        <Route path='/about' element={<About />} />
        <Route path='/success' element={<SuccessPage/>} />
        <Route path='/order/details' element={<Delivery/>} />
        <Route path='*' element={<ErrorPage/>} />
      </Routes>
      <Footer/>
      </ScrollPageToTop>
      </BrowserRouter>
      </Provider>
      </GoogleOAuthProvider>
      </SkeletonTheme>
    </div>
  );
}

export default App;
