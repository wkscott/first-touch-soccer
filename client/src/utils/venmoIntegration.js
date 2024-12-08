import axios from 'axios';

export const initiateVenmoPayment = async (paymentData) => {
  try {
    // Create Venmo payment request
    const response = await axios.post('http://localhost:5000/api/payments/venmo', {
      amount: paymentData.amount,
      note: `First Touch LLC - Training Session on ${paymentData.sessionDate}`,
      recipient: process.env.REACT_APP_VENMO_BUSINESS_ID, // Coach's Venmo ID
      player_id: paymentData.player_id,
      session_id: paymentData.session_id
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Venmo payment failed: ' + error.message);
  }
}; 