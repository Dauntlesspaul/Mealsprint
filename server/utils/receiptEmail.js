const receiptEmail = (userName, items, totalPrice, discount, Subtotal, deliveryAddress) => {
    const itemRows = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.units}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">£${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    return {
      subject: "Your Meal Sprint Order Receipt",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="text-align: center; color: #ff6347;">Thank you for your order, ${userName}!</h2>
          <p style="font-size: 18px;">Here is a summary of your purchase:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; background-color: #ff6347; color: white;">Item</th>
                <th style="text-align: right; padding: 8px; background-color: #ff6347; color: white;">Quantity</th>
                <th style="text-align: right; padding: 8px; background-color: #ff6347; color: white;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 8px; border-top: 2px solid #ff6347; text-align: right;" colspan="2"><strong>Subtotal:</strong></td>
                <td style="padding: 8px; border-top: 2px solid #ff6347; text-align: right;"><strong>£${Subtotal.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-top: 2px solid #ff6347; text-align: right;" colspan="2"><strong>Discount:</strong></td>
                <td style="padding: 8px; border-top: 2px solid #ff6347; text-align: right;"><strong>${typeof discount === 'string' ? discount : `£${discount.toFixed(2)}`}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-top: 2px solid #ff6347; text-align: right;" colspan="2"><strong>Total:</strong></td>
                <td style="padding: 8px; border-top: 2px solid #ff6347; text-align: right;"><strong>£${totalPrice.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          <p style="font-size: 16px; margin-top: 20px;">
            Your order is on its way to <strong>${deliveryAddress}</strong> and should arrive within 30 minutes.
          </p>
          <p style="font-size: 16px; margin-top: 20px;">
            We hope you enjoy your meal! If you have any questions or concerns, feel free to contact us.
          </p>
          <p style="font-size: 16px;">
            Best regards,<br>
            <strong>Meal Sprint Team</strong>
          </p>
        </div>
      `,
    };
  };

module.exports = receiptEmail;
