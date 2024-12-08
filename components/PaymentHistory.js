import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentHistory.css';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get('/api/payments/history');
            setPayments(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load payment history');
            setLoading(false);
        }
    };

    const handleRefundRequest = async (paymentId, reason) => {
        try {
            await axios.post(`/api/payments/${paymentId}/refund`, { reason });
            fetchPayments(); // Refresh the list
        } catch (error) {
            setError('Failed to request refund');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="payment-history">
            <h2>Payment History</h2>
            <div className="payments-list">
                {payments.map(payment => (
                    <div key={payment._id} className="payment-card">
                        <div className="payment-header">
                            <span className={`status-badge ${payment.status}`}>
                                {payment.status}
                            </span>
                            <span className="payment-date">
                                {new Date(payment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="payment-details">
                            <p className="amount">{payment.formattedAmount}</p>
                            <p className="booking-info">
                                Booking: {new Date(payment.booking.date).toLocaleDateString()} 
                                at {payment.booking.time}
                            </p>
                            {payment.verificationStatus === 'verified' && (
                                <p className="verification-info">
                                    Verified on {new Date(payment.verificationDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        <div className="payment-actions">
                            {payment.receiptUrl && (
                                <a 
                                    href={payment.receiptUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="receipt-button"
                                >
                                    Download Receipt
                                </a>
                            )}
                            {payment.status === 'completed' && (
                                <button
                                    onClick={() => {
                                        const reason = window.prompt('Please provide a reason for the refund:');
                                        if (reason) handleRefundRequest(payment._id, reason);
                                    }}
                                    className="refund-button"
                                >
                                    Request Refund
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentHistory; 