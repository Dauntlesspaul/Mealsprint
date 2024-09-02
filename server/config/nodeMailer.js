const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port:465,
  secure:true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

async function main(user, subject, text ) {
  const info = await transporter.sendMail({
    from: `"Meal Sprint" <${process.env.GMAIL_USER}>`, 
    to: user, 
    subject: subject, 
    text: text, 
  });
}

async function mainHTML(user, subject, html) {
  const info = await transporter.sendMail({
    from: `"Meal Sprint" <${process.env.GMAIL_USER}>`, 
    to: user, 
    subject: subject, 
    html: html,  
  });
  console.log('Email sent:', info.messageId);
}

module.exports = {main, mainHTML};
