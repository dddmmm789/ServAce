import React from 'react';
import { Link } from 'react-router-dom';

function PendingApproval() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="pending-status">
          <div className="status-icon">⏳</div>
          <h1>Application Under Review</h1>
          <p>
            Thank you for registering! Your application is currently under review. 
            This process typically takes 1-2 business days.
          </p>
          <p>
            We'll notify you via SMS once your application has been reviewed.
          </p>
          <div className="support-info">
            <p>Need help? Contact support:</p>
            <p>📞 Support: +1234567890</p>
            <p>✉️ Email: support@example.com</p>
          </div>
          <Link to="/auth/login" className="login-link">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PendingApproval; 