const checkAPI = async () => {
    const endpoints = [
        '/api/auth',
        '/api/users',
        '/api/coaches',
        '/api/bookings',
        '/api/payments',
        '/api/reviews'
    ];

    return Promise.all(endpoints.map(async endpoint => {
        try {
            const response = await axios.get(endpoint);
            return `✅ ${endpoint}: ${response.status}`;
        } catch (error) {
            return `❌ ${endpoint}: ${error.message}`;
        }
    }));
}; 