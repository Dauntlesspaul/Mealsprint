import {configureStore} from "@reduxjs/toolkit"
import categoryReducer from "./categorySlice"
import sideBarReducer from "./sliderSlice"
import productReducer from "./introProducts"
import dialogReducer from "./dialogSlice"
import quantityReducer from './quantitySlice'
import allproductsReducer from "./allproductsSlice"
import cartReducer from './cartSlice'
import orderReducer from './orderSlice'
import totalReducer from './orderSumSlice'
import searchReducer from './searchSlice'
import signupReducer from './signupSlice';
import loginReducer from './loginSlice';
import countDownReducer from './countDownSlice';
import verificationReducer from './verificationSlice';
import userReducer from './profileSlice';
import logoutReducer from './logoutSlice';
import editReducer from './profileEditSlice';
import addressReducer from './newAddressSlice';
import deleteReducer from './deleteAddressSlice';
import passwordChangeReducer from './changePasswordSlice';
import pictureReducer from './pictureSlice';
import imageReducer from './cropedImageSlice';
import googleReducer from './googleSlice';
import passwordReducer from './passwordSlice';
import setpasswordReducer from './setPasswordSlice';
import letterReducer from './newsletterSlice';
import couponReducer from './couponSlice';
import deliveryReducer from './deliverySlice';
import notificationreducer from './notificationSlice';

const store = configureStore({
    reducer: {
       category: categoryReducer,
       sidebar: sideBarReducer, 
       products: productReducer,
       dialog: dialogReducer,
       quantity: quantityReducer,
       allproducts: allproductsReducer,
       cart: cartReducer,
       order: orderReducer,
       sum: totalReducer,
       search: searchReducer,
       signup: signupReducer,
       login: loginReducer,
       countdown: countDownReducer,
       verify: verificationReducer,
       user: userReducer,
       logout: logoutReducer,
       edit: editReducer,
       newaddress: addressReducer,
       delete: deleteReducer,
       password: passwordChangeReducer,
       picture: pictureReducer,
       image: imageReducer,
       google: googleReducer,
       passwordcheck: passwordReducer,
       setpassword: setpasswordReducer,
       letter: letterReducer,
       coupon: couponReducer,
       delivery: deliveryReducer,
       notification: notificationreducer,
    }
})

export default store