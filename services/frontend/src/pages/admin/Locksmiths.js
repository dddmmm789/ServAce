import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/admin.css';
import { adminMethods } from '../../services/api';

function Locksmiths() {
  const [locksmiths, setLocksmiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const status = new URLSearchParams(location.search).get('status');

  useEffect(() => {
    console.log('=== LOCKSMITHS COMPONENT MOUNTED ===');
    console.log('Current URL:', window.location.href);
    console.log('Status parameter:', status);
    console.log('Auth token:', localStorage.getItem('token'));

    const fetchLocksmiths = async () => {
      try {
        console.log('🔄 Starting to fetch locksmiths...');
        
        // Log the exact URL we're trying to fetch
        console.log('📍 Attempting to fetch from:', `/api/admin/locksmiths${status ? `?status=${status}` : ''}`);
        
        const data = status 
          ? await adminMethods.getLocksmithsByStatus(status)
          : await adminMethods.getLocksmiths();
        
        console.log('✅ Received data:', data);
        setLocksmiths(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.log('❌ Error occurred:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack
        });
        setError('Failed to load locksmiths');
        if (error.response?.status === 401) {
          console.log('🔒 Unauthorized - redirecting to login');
          navigate('/admin/login');
        }
      }
    };

    fetchLocksmiths();
  }, [status, navigate]);

  if (loading) {
    console.log('⏳ Component is in loading state');
    return (
      <div className="admin-page">
        <div className="loading-state">
          <h3>Loading Locksmiths...</h3>
          <p>Current status filter: {status || 'none'}</p>
          <p>Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  }

  console.log('🎯 Rendering component with locksmiths:', locksmiths);

  if (error) {
    console.log('6. Showing error:', error);
    return (
      <div className="admin-page">
        <div className="error-message">
          <h3>Error Loading Locksmiths</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header>
        <button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
        <h1>Locksmiths ({status || 'all'})</h1>
      </header>

      <div className="locksmith-grid">
        {locksmiths.length === 0 ? (
          <div className="no-data">No locksmiths found</div>
        ) : (
          locksmiths.map(locksmith => (
            <div key={locksmith._id} className="locksmith-card">
              <div className="locksmith-header">
                <h2>{locksmith.name}</h2>
                <span className={`status-badge ${locksmith.verificationStatus}`}>
                  {locksmith.verificationStatus}
                </span>
              </div>
              <div className="card-actions">
                <button 
                  onClick={() => navigate(`/admin/locksmiths/${locksmith._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Locksmiths; 