function generateWelcomeMessage(userName) {
    return `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f8f8f8; border-radius: 8px; width: 80%; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h1 style="color: #ff6347;">Welcome to Foodsprint!</h1>
        <p style="font-size: 18px; color: #333;">
          Hi ${userName}, we're thrilled to have you on board! Get ready to enjoy delicious meals delivered right to your doorstep.
        </p>
        <p style="font-size: 16px; color: #555;">
          As a welcome gift, here's a special discount just for you. Use code <strong style="color: #ff6347;">MS1710</strong> at checkout to get 10% off your first order!
        </p>
        <a href="https://mealsprint.vercel.app/menu" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #ff6347; color: white; text-decoration: none; border-radius: 4px; font-size: 16px;">
          Start Shopping
        </a>
      </div>
    `;
  }
  
  module.exports = generateWelcomeMessage;
  