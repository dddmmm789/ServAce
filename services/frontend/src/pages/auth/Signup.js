import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', or 'profile'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    businessName: '',
    serviceArea: '',
    licenseNumber: '',
    insuranceInfo: '',
    idProof: null,
    licenseProof: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const requestOTP = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError('Please accept the Terms & Conditions and Privacy Policy');
      return;
    }
    
    try {
      await axios.post('/api/locksmith/request-otp', { phone });
      setStep('otp');
      setError('');
      // In development, show OTP hint
      if (process.env.NODE_ENV === 'development') {
        setError('Development OTP: 123456');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/locksmith/verify-otp', {
        phone,
        otp
      });
      // After OTP verification, move to profile completion
      setStep('profile');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setProfile(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(profile).forEach(key => {
        formData.append(key, profile[key]);
      });
      formData.append('phone', phone);

      const response = await axios.post('/api/locksmith/complete-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Show pending approval message and redirect
      navigate('/auth/pending-approval');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit profile');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Locksmith Sign Up</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {step === 'phone' && (
          <form onSubmit={requestOTP} className="auth-form">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div className="terms-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                I accept the{' '}
                <Link to="/terms" target="_blank">Terms & Conditions</Link>
                {' '}and{' '}
                <Link to="/privacy" target="_blank">Privacy Policy</Link>
              </label>
            </div>
            
            <button type="submit" className="submit-btn">
              Get OTP
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={verifyOTP} className="auth-form">
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP sent to your phone"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Verify & Sign Up
            </button>
            
            <button 
              type="button" 
              className="back-btn"
              onClick={() => setStep('phone')}
            >
              Back
            </button>
          </form>
        )}

        {step === 'profile' && (
          <form onSubmit={submitProfile} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Business Name</label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Service Area</label>
              <input
                type="text"
                value={profile.serviceArea}
                onChange={(e) => setProfile({...profile, serviceArea: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>License Number</label>
              <input
                type="text"
                value={profile.licenseNumber}
                onChange={(e) => setProfile({...profile, licenseNumber: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Insurance Information</label>
              <textarea
                value={profile.insuranceInfo}
                onChange={(e) => setProfile({...profile, insuranceInfo: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>ID Proof</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'idProof')}
                accept="image/*,.pdf"
                required
              />
            </div>

            <div className="form-group">
              <label>License Proof</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'licenseProof')}
                accept="image/*,.pdf"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit for Approval
            </button>
          </form>
        )}

        <div className="auth-links">
          <Link to="/auth/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup; 