const welcomeEmail = (userName, verificationCode) => {
    return {
      subject: "Welcome to Meal Sprint! Please Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="text-align: center; color: #ff6347;">Welcome to Meal Sprint!</h2>
          <p style="font-size: 18px;">Dear ${userName},</p>
          <p style="font-size: 16px;">
            Thank you for signing up with us! To complete your registration, please use the verification code below:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; padding: 10px 20px; font-size: 20px; background-color: #ff6347; color: white; border-radius: 5px;">
              ${verificationCode}
            </span>
          </div>
          <p style="font-size: 16px;">
            If you didn’t sign up for an account, please ignore this email.
          </p>
          <p style="font-size: 16px;">
            Welcome to the Meal Sprint family!
          </p>
          <p style="font-size: 16px;">
            Best regards,<br>
            <strong>Meal Sprint Team</strong>
          </p>
        </div>
      `,
    };
  };
  
  module.exports = welcomeEmail;
  