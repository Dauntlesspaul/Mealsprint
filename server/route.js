const express = require('express');
const router = express.Router();
const Foods = require('./model/foods');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");;
const multerS3 = require('multer-s3');
require('dotenv').config();
const User = require('./model/User');
const Token = require('./model/token');
const { main, mainHTML } = require('./config/nodeMailer');
const stripe = require('stripe')(process.env.STRIPE_KEYS)
const Cart = require('./model/Cart')
const ResetToken = require('./model/resettoken')
const Order = require('./model/Order')
const welcomeEmail = require('./utils/welcomeEmail')
const generateWelcomeMessage = require('./utils/welcomeMessage');
const generateMealSprintNewsletter = require('./utils/newsLetter');
// AWS S3 Configuration
const bucketName = process.env.BUCKET_NAME;
const bucketNameSecond = process.env.BUCKET_NAME_SEC;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
});



// Generate random token
const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//jwtsecret
const jwtSecret = process.env.JWT_SECRET


const authenticateToken = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    return res.status(401).send({message:'Access Denied. No Token Provided'});
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({message: 'Access Denied. Invalid Token'});
  }
};

// Multer S3 configuration
const upload = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname ,  contentType: 'image/png'});
    },
    key: function (req, file, cb) {
     
      cb(null, `${randomToken()}.jpeg`);
    }
  })
});

const profileUpload = multer({
  storage: multerS3({
    s3,
    bucket: bucketNameSecond,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueKey = `${randomToken()}.jpeg`;
      cb(null, uniqueKey);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE, 
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, 
}).single('file');

const uploadMiddleware = upload.single('file');



const deletePreviousProfilePicture = async (profilePictureUrl) => {
  if (!profilePictureUrl) return;

  const parts = profilePictureUrl.split('/');
  const key = parts[parts.length - 1];

  try {
    const params = {
      Bucket: bucketNameSecond,
      Key: key,
    };
    const deleteCommand = new DeleteObjectCommand(params);
    await s3.send(deleteCommand);
  } catch (err) {
    console.error('Error deleting previous profile picture:', err);
    throw new Error('Error deleting previous profile picture');
  }
};

const updateProfilePicture = async (userId, location) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { profilePicture: location } });
  } catch (err) {
    console.error('Error updating user profile picture in database:', err);
    throw new Error('Error updating profile picture');
  }
};




// Routes

router.post('/upload', uploadMiddleware, async (req, res) => {
  try {
    
   const imageUrl = req.file.location;

    const addFood = new Foods({
      imageurl: imageUrl,
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      section: req.body.section
    });
    await addFood.save();
    console.log('New items added to the database!');

    return res.json({ message: 'File received' });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal Server Error');
  }
})

router.get('/intro-products', async (req, res) => {
  try {
    const slug = req.query.category;
    if(slug === 'all'){
     const products = await Foods.find({section: 'home'})
      return res.status(200).send(products)
    }else{
      const products = await Foods.find({category: slug})
      return res.status(200).send(products)
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/all-products', async (req, res) => {
  try {
   
     const products = await Foods.find()
     return res.status(200).send(products)
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/search', async (req, res) => {
  try {
    const slug = req.query.q.trim();
    
    if (slug === '') {
      return res.status(200).send([]);
    }

    const noSpecialChars = slug.replace(/[^a-zA-Z0-9\s]/g, '');
    const regex = new RegExp(noSpecialChars, 'i');

    const products = await Foods.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: regex } },   
            { description: { $regex: regex } } 
          ]
        }
      }
    ]);


    if (products.length === 0) {
      return res.status(404).send([{ message: 'No products found' }]);
    }

    return  res.status(200).send(products);
    
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/sign-up', async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.status(409).send({ message: 'User with the given email already exists!' });
    }

    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    const hashedPassword = bcrypt.hashSync(password, salt);
    user = await new User({
       firstname: firstName.charAt(0).toUpperCase() + firstName.slice(1),
       lastname: lastName.charAt(0).toUpperCase() + lastName.slice(1),
       email: email.toLowerCase(),
       password: hashedPassword 
      }).save();

    const token = await new Token({
      userId: user._id,
      token: generateVerificationToken()
    }).save();

    const message = welcomeEmail(user.firstname,token.token)
    await mainHTML(user.email, message.subject, message.html);
    return res.status(201).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/verify-user', async (req, res) => {
  try {
    const {code, email} = req.query;
  
    const user = await User.findOne({ email: email});
    if (!user) {
      return res.status(400).send({ message: 'Invalid link! User not found' , status: falase});
    }
    
    const otp = await Token.findOne({
      userId: user._id,
      token: code
    });

    if (!otp) {
      return res.status(400).send({ message: 'Oops, invalid verification code', status: false });
    }
    
    await User.updateOne({ _id: user._id }, { $set: { verified: true } });
    await Token.deleteOne({ _id: otp._id });

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    req.session.token = token;

    const message = generateWelcomeMessage(user.firstname,)
    await mainHTML(user.email, 'Mealsprint', message);

    return res.status(200).send({ message: 'Email verified successfully' , status: true});
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
});


router.post('/edit-profile',authenticateToken,  async(req,res)=>{
  try{

  const {userId} = req.user
  const {firstname, lastname, phone} = req.body

  const fieldsToBeUpdated = {
    $set: {
      firstname: firstname.charAt(0).toUpperCase() + firstname.slice(1),
      lastname: lastname.charAt(0).toUpperCase() + lastname.slice(1),
      phone: phone || ''
    }
  }

  await User.updateOne({_id: userId}, fieldsToBeUpdated)

   return res.status(200).send({messgae: 'User profile successfully updated'})
  }catch(error){
    console.log(error)
    return res.status(500).send('Internal Server Error')
  }
})


router.post('/sign-in', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(404).send({ message: 'Invalid Credentials' });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(404).send({ message: 'Invalid Credentials' });
    }

    if (!user.verified) {
      return res.status(206).send({ message: 'User not verified yet' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    req.session.token = token;

    return res.send({ message: 'Access granted' });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
});


router.get('/user-profile',authenticateToken,  async(req,res)=>{
  try{

  const {userId} = req.user
  const user = await User.findOne({_id: userId})
  .select("firstname lastname phone email addresses profilePicture")

   return res.status(200).send(user)
  }catch(error){
    console.log(error)
    return res.status(500).send('Internal Server Error')
  }
})


router.post('/newaddress', authenticateToken, async(req,res)=>{
  try{
    const {userId} = req.user
    const {houseNumber, zipCode, city, phoneNumber} = req.body
  const user = await User.findById({_id: userId})
  if(!user){
    return res.status(404).send({'message': 'User not found'})
  }
    const newAddress = {
      city,
      houseno: houseNumber,
      zipcode:zipCode,
      phone: phoneNumber,
    }
    user.addresses.push(newAddress);
    await user.save();
    return res.status(200).send({'messgae': 'New address added'})

  }catch(error){
    console.log(error)
    return res.status(500).send('Internal Server Error')
  }
})

router.post('/delete-address', authenticateToken, async(req,res)=>{
  try{
    const {userId} = req.user
    const {addressId} = req.query
   
  let user = await User.findById({_id: userId})
  if(!user){
    return res.status(404).send({'message': 'User not found'})
  }
   
  await User.updateOne(
    { _id: userId },
    { $pull: { addresses: { _id: addressId } } }
  )

    return res.status(200).send({message: 'address deleted!'})

  }catch(error){
    console.log(error)
    return res.status(500).send('Internal Server Error')
  }
})


router.post('/change-password', authenticateToken, async(req,res)=>{
  try{
    const {userId} = req.user
    const {currentPassword, newPassword} = req.body;

    const user = await User.findById({_id: userId})
    const isPassword = await bcrypt.compare(currentPassword, user.password)
    if(!isPassword){
      return res.status(404).send({message: "Invalid Credentials"})
    }
    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await User.updateOne({_id: userId}, {$set: {password: hashedPassword}})

    return res.status(200).send({'message': 'password successfully changed'} )

  }catch(error){
    console.log(error)
    return res.status(500).send('Internal Server Error')
  }
})

router.post('/profile-upload', authenticateToken, profileUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded!' });
    }

    const { location } = req.file;
    const userId = req.user.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send({ message: 'User not found!' });
    }

    await deletePreviousProfilePicture(user.profilePicture);

    await updateProfilePicture(user._id, location);


    return res.status(200).send({message: 'image sucessfully uploaded!'});
  } catch (err) {
    console.error('Profile upload failed:', err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});


router.post('/google-auth', async (req, res) => {

  const { given_name, family_name, email} = req.body.profile;
  const {phoneNumber} = req.body;

  try{
      let user = await User.findOne({ email: email });

      if (user) {
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
        req.session.token = token;
         
          return res.status(200).send({ message: 'access granted'});
      }

    
        const givenName = given_name.charAt(0).toUpperCase() + given_name.slice(1)
        const familyName = family_name.charAt(0).toUpperCase() + family_name.slice(1)
       user = new User({
          firstname: givenName,
          lastname: familyName,
          email: email.toLowerCase(),
          phone: phoneNumber,
          verified: true
      });

      await user.save();
      
      const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
      req.session.token = token;

      const message = welcomeEmail(user.firstname,token.token)
      await mainHTML(user.email, message.subject, message.html);

      return res.status(201).send({message: 'User created'});
  } catch (error) {
      console.error('Error signing in with Google:', error);
      return res.status(500).send('Internal Server Error');
  }
});

router.get('/password-check', authenticateToken, async (req, res) => {

  const {userId} =req.user;

  try{
      let user = await User.findById({ _id: userId });

      if (!user.password) {
          return res.status(404).send({ message: 'No manual password associated with this account!'});
      }

      return res.status(201).send({message: true});
  } catch (error) {
      console.error('Error signing in with Google:', error);
      return res.status(500).send('Internal Server Error');
  }
});
router.post('/set-password', authenticateToken, async(req,res)=>{
  try{
    const {userId} = req.user
    const {newPassword} = req.body
   
    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await User.updateOne({_id: userId}, {$set: {password: hashedPassword}})

    return res.status(200).send({'message': 'password successfully set'} )

  }catch(error){
    console.log(error)
    return res.status(500).send('Internal Server Error')
  }
})

router.post('/news-letter', async(req,res)=>{

  try{ 
    const {email} = req.body
    const products = await Foods.find({section : 'home'})
    let name;
    const user = await User.findOne({email: email})

    if(!user){
      name = ' our prospective customer';
    }else{
      name = user.firstname;
    }
    const message = generateMealSprintNewsletter( name, products)
    await mainHTML(email, 'Mealsprint', message);
    return res.status(200).send({message: 'news letter successfully sent'})
 }catch(error){
  console.log(error)
 }  
 })
 

  router.post('/remove-profile-pic', authenticateToken, async(req, res) => {
    try {
      
      
      const user_id = req.user.userId;
      let user = await User.findOne({ _id: user_id});

      if (!user) {
        return res.status(404).send({ 'message': 'User not found!' });
      }
      const url = user.profilePicture
      if(url){
      const parts = url.split('/')
      const key = parts[parts.length - 1]
      const params = {
        Bucket: bucketName2, 
        Key: key
      } 
      const deleteCommand = new DeleteObjectCommand(params);
      await s3.send(deleteCommand)
    }
      await User.updateOne({ _id: user._id }, { $set: { profilePicture: '' } });
      
      return res.status(200).send({message: 'Image successfully removed'})

    } catch (err) {
      console.log(err);
      return res.status(500).send('Internal Server Error');
    }
  });









router.post('/resend-email-verification', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: email });

    if (user && !user.verified) {
      await Token.updateOne({ userId: user._id}, { $set: { token: randomToken()} });
      const token = await Token.findOne({ userId: user._id });
      if(!token){
        return res.status(400).send({message: 'Token not found!'})
      }
      const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
      const message = `Welcome to Shoe Haven ${user.firstname}, please follow the link to verify your email: ${url}`;
      await main(user.email, 'Email Verification', message);

      return res.status(201).send({ message: 'A verification link was sent to your email, please click on the link to verify your email' });
    }

    return res.status(404).send({ message: "User is already verified" });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/new-email-verification', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: email });
    if (user && !user.verified) {
      const exist = await Token.findOne({userId : user._id})
      if(exist){
      await Token.updateOne({ userId: user._id},{$set: {token: randomToken()}});
      const token = await Token.findOne({ userId: user._id });
      const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
      const message = `Welcome to Shoe Haven ${user.firstname}, please follow the link to verify your email: ${url}`;
      await main(user.email, 'Email Verification', message);

      return res.status(201).send({ message: 'A verification link was sent to your email, please click on the link to verify your email' });
      }else{
      const newToken = new Token({
        userId: user._id,
        token: randomToken()
      })
      await newToken.save()
      const token = await Token.findOne({ userId: user._id });
      console.log(token)
      const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
      const message = `Welcome to Shoe Haven ${user.firstname}, please follow the link to verify your email: ${url}`;
      await main(user.email, 'Email Verification', message);

      return res.status(201).send({ message: 'A verification link was sent to your email, please click on the link to verify your email' });
     }
   }
    return res.status(404).send({ message: "User already verified" });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
});



router.get('/order-list', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const userOrders = await Order.find({userId: userId}).sort({createdAt: -1})
    
    return res.status(200).send(userOrders);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
})



router.get('/validate-coupon',(req,res)=>{
  const {code}= req.query

  if(code === 'MS1710'){
    return res.status(200).send({message: "Congratulations! you've received 10% discount"})
  }

  return res.status(404).send({message: 'Invalid coupon code'})
})




router.post('/create-payment-intent', async (req, res) => {
  const { total, coupon, cart, name, email, phone , address } = req.body;



  if (isNaN(total) || total <= 0) {
    return res.status(400).json({ error: 'Invalid total amount' });
  }


  let amount = Math.round(Number(total) * 100); 

  if (coupon) {
    const discount = Math.round(amount * 0.10); 
    amount -= discount;
  }

  let userId = '';    
  const user = await User.findOne({ email: email });
  if (user) {
    userId = user._id.toString(); 
  }


  const newCart = new Cart({
    userId: userId,
    items: cart
  });

  try {
    const savedCart = await newCart.save();

    const randomNum = crypto.randomInt(0, 1000000);
    const orderId = randomNum.toString().padStart(6, '0');

  
    const customer = await stripe.customers.create({
      name: name, 
      email: email, 
      phone: phone, 
      metadata: {
        cartId: savedCart._id.toString(),
        orderId,
        userId: userId || email.toString(),
        coupon: coupon
      },
    });

 
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'gbp', 
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      shipping: {
        name: name, 
        phone: phone, 
        address: {
          line1: address, 
          city: 'Wolverhampton',
          country: 'GB',
        },
      },
      metadata: {
        orderId,
        cartId: savedCart._id.toString(),
        userId: userId || email.toString(),
      },
    });

    return res.json({
      client_secret: paymentIntent.client_secret,
      orderId,
      name,
      email,
      address
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ error: 'Payment processing failed' });
  }
});






router.post('/reset-link', async(req,res)=>{
  try{
 const {email} = req.body
 const user = await User.findOne({email: email})
 if(!user){
  return res.status(404).send({message: 'User not found'})
 }
 const resetEmail = await ResetToken.findOne({email: email})
  if(resetEmail){
    await ResetToken.deleteOne({email: email})
  }
 const newToken = await new ResetToken({
  token: randomToken(),
  email: email,
 })
 await newToken.save()

 const url = `${process.env.BASE_URL}users/${user._id}/${user.email}/reset-link/${newToken.token}`;
    const message = `Dear ${user.firstname}, please follow the link to reset your password: ${url}`;
    await main(user.email, 'Reset Password', message);
 return res.status(200).send({message: "Reset link sent!"})
  }catch(error){
    console.log(error)
    return res.status(500).send({message: 'Internal Server Error'})
  }

})

router.post('/reset-link-change-password', async(req,res)=>{
  try{
 
 const {email, token, id, password} = req.body

 const verifyToken = await ResetToken.findOne({token: token})
 if(!verifyToken){
  return res.status(404).send({message: 'Reset linke expired'})
 }
 const user = await User.findOne({email: email})
  if(!user){
   return res.status(404).send({message: 'User not found'})
  }
  const salt = bcrypt.genSaltSync(Number(process.env.SALT));
  const hashedPassword = bcrypt.hashSync(password, salt);

  await User.updateOne({_id: id}, {$set: {password: hashedPassword}})
  
  await ResetToken.deleteOne({email: email})

  return res.status(200).send({'message': 'Password successfully reset'} )
  }catch(error){
    console.log(error)
    return res.status(500).send({message: 'Internal Server Error'})
  }

})


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.clearCookie('connect.sid');
    return res.status(200).send({ message: 'Logout successful' });
  });
});




module.exports = router;

