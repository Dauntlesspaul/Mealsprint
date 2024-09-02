function generateMealSprintNewsletter(userName, featuredMeals) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Meal Sprint Newsletter</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
        }
        .header h1 {
          color: #ff6347;
          font-size: 28px;
        }
        .content {
          text-align: center;
          margin-top: 20px;
        }
        .content h2 {
          font-size: 22px;
          color: #333;
        }
        .content p {
          font-size: 16px;
          color: #555;
        }
        .meal {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .meal img {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          margin-right: 20px;
        }
        .meal .meal-info {
          text-align: left;
        }
        .meal .meal-info h3 {
          font-size: 18px;
          margin: 0;
          color: #333;
        }
        .meal .meal-info p {
          font-size: 14px;
          margin: 5px 0 0;
          color: #777;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 14px;
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Meal Sprint Newsletter</h1>
        </div>
        <div class="content">
          <h2>Hello, ${userName}!</h2>
          <p>Check out our featured meals for this week:</p>
          ${featuredMeals.map(meal => `
            <div class="meal">
              <img src="${meal.imageurl}" alt="${meal.name}">
              <div class="meal-info">
                <h3>${meal.name}</h3>
                <p>${meal.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="footer">
          <p>Thank you for being a part of the Meal Sprint community!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = generateMealSprintNewsletter;
