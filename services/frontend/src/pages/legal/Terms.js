import React from 'react';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Terms & Conditions</h1>
        
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Locksmith Platform, you agree to be bound by these 
            Terms & Conditions. If you do not agree to these terms, please do not use the platform.
          </p>
        </section>

        <section>
          <h2>2. Service Provider Requirements</h2>
          <p>
            To register as a locksmith on our platform, you must:
          </p>
          <ul>
            <li>Be at least 18 years old</li>
            <li>Have valid professional certification/license</li>
            <li>Maintain appropriate insurance coverage</li>
            <li>Pass our verification process</li>
          </ul>
        </section>

        <section>
          <h2>3. Service Standards</h2>
          <p>
            As a locksmith on our platform, you agree to:
          </p>
          <ul>
            <li>Provide services professionally and promptly</li>
            <li>Maintain accurate availability status</li>
            <li>Respond to service requests within specified timeframes</li>
            <li>Maintain appropriate professional standards</li>
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

export default Terms; 