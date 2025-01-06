import React from 'react';
import { Link } from 'react-router-dom';

function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect the following information from locksmiths:
          </p>
          <ul>
            <li>Phone number for authentication</li>
            <li>Location data during active jobs</li>
            <li>Service history and ratings</li>
            <li>Professional credentials</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is used to:
          </p>
          <ul>
            <li>Verify your identity</li>
            <li>Match you with customers</li>
            <li>Process payments</li>
            <li>Improve our services</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information:
          </p>
          <ul>
            <li>Encrypted data transmission</li>
            <li>Secure data storage</li>
            <li>Regular security audits</li>
            <li>Access controls</li>
          </ul>
        </section>

        {/* Add more sections as needed */}
        
        <div className="legal-footer">
          <Link to="/auth/signup">Back to Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Privacy; 