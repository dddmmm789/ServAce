import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/locksmith.css';

function Login() {
  const [credentials, setCredentials] = useState({
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/api/locksmith/login', {
        phone: credentials.phone.startsWith('+1') ? credentials.phone : `(${credentials.phone.slice(0,3)}) ${credentials.phone.slice(3,6)}-${credentials.phone.slice(6)}`,
        password: credentials.password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/locksmith/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Locksmith Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={credentials.phone}
              onChange={(e) => setCredentials({...credentials, phone: e.target.value})}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login; 