import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { initiateVenmoPayment } from '../utils/venmoIntegration';

function PaymentPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'venmo'

  // Fetch user's booked sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Replace with actual user ID from authentication
        const userId = 'user_id';
        const response = await axios.get(`http://localhost:5000/api/users/${userId}/sessions`);
        setSessions(response.data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    fetchSessions();
  }, []);

  const handlePayment = async () => {
    if (!selectedSession) return;

    try {
      if (paymentMethod === 'venmo') {
        const venmoResponse = await initiateVenmoPayment({
          amount: selectedSession.duration * 50,
          sessionDate: new Date(selectedSession.date).toLocaleDateString(),
          player_id: 'user_id', // Replace with actual user ID
          session_id: selectedSession._id
        });

        // Handle mobile vs web
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = venmoResponse.venmo_link;
        } else {
          window.open(venmoResponse.web_fallback, '_blank');
        }

        // Poll for payment status
        const checkPaymentStatus = setInterval(async () => {
          try {
            const statusResponse = await axios.post('/api/payments/venmo/verify', {
              payment_id: venmoResponse.payment_id
            });
            
            if (statusResponse.data.status === 'success') {
              clearInterval(checkPaymentStatus);
              // Update UI to show success
              setSelectedSession(null);
              // Refresh sessions list
              const response = await axios.get(`http://localhost:5000/api/users/user_id/sessions`);
              setSessions(response.data);
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
          }
        }, 5000); // Check every 5 seconds
      } else {
        const paymentData = {
          session_id: selectedSession._id,
          player_id: 'user_id', // Replace with actual user ID
          amount: selectedSession.duration * 50, // $50 per hour
          payment_method: paymentMethod
        };

        await axios.post('http://localhost:5000/api/payments', paymentData);
        // Reset selection after successful payment
        setSelectedSession(null);
        
        // Refresh sessions list
        const response = await axios.get(`http://localhost:5000/api/users/user_id/sessions`);
        setSessions(response.data);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Process Payment</h1>

        {/* Session Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Training Session</h2>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session._id}
                onClick={() => setSelectedSession(session)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedSession?._id === session._id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {new Date(session.date).toLocaleDateString()} at {session.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {session.duration} hours
                    </p>
                  </div>
                  <div className="text-lg font-semibold">
                    ${session.duration * 50}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-x-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`px-6 py-3 rounded-lg ${
                paymentMethod === 'card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Credit Card
            </button>
            <button
              onClick={() => setPaymentMethod('venmo')}
              className={`px-6 py-3 rounded-lg ${
                paymentMethod === 'venmo'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Venmo
            </button>
          </div>
        </div>

        {/* Payment Button */}
        <div className="flex justify-end">
          <button
            onClick={handlePayment}
            disabled={!selectedSession}
            className={`px-8 py-4 rounded-lg text-lg ${
              selectedSession
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Pay ${selectedSession ? selectedSession.duration * 50 : '0'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage; 