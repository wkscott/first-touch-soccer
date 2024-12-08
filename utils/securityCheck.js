const checkSecurity = async () => {
    const checks = {
        ssl: await verifySSL(),
        cors: verifyCORS(),
        headers: verifySecurityHeaders(),
        auth: verifyAuthSystem(),
        rateLimit: verifyRateLimiting(),
        dataEncryption: verifyEncryption(),
        inputSanitization: verifySanitization()
    };

    return Object.entries(checks).reduce((acc, [key, value]) => {
        if (!value.passed) {
            acc.push(`❌ ${key}: ${value.message}`);
        } else {
            acc.push(`✅ ${key}`);
        }
        return acc;
    }, []);
}; 