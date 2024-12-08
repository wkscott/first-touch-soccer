import React, { useState } from 'react';

const SignupForm = () => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    
    return (
        <form onSubmit={handleSubmit}>
            {/* ... other form fields ... */}
            
            <div className="form-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        required
                    />
                    I agree to the <a href="/terms" target="_blank">Terms of Service</a> and 
                    <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                </label>
            </div>
            
            <button type="submit" disabled={!acceptedTerms}>
                Sign Up
            </button>
        </form>
    );
};

export default SignupForm; 