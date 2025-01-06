import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/locksmith.css';

function ServiceProviderDashboard() {
  const [activeJob, setActiveJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveJob();
  }, []);

  const fetchActiveJob = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/locksmith/jobs/active', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      setActiveJob(data.job);
    } catch (error) {
      console.error('Error fetching active job:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTracking = (jobId) => {
    window.open(`/locksmith/job/${jobId}/track`, '_blank');
  };

  const handleCompleteJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3002/api/locksmith/jobs/${jobId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      // Refresh the active job data
      fetchActiveJob();
    } catch (error) {
      console.error('Error completing job:', error);
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Locksmith Dashboard</h1>
      
      {/* Active Job Section */}
      <div className="active-job-section">
        <h2>Active Job</h2>
        {activeJob && activeJob.customer ? (
          <div className="job-card">
            <div className="job-details">
              <h3>Customer: {activeJob.customer.name}</h3>
              <p>Phone: {activeJob.customer.phone}</p>
              <p>Address: {activeJob.location?.address?.formatted || 'Address not available'}</p>
              <p>Status: <span className="status-active">Active</span></p>
              
              <div className="job-actions">
                <button 
                  className="tracking-btn"
                  onClick={() => handleViewTracking(activeJob._id)}
                >
                  View Tracking Page
                </button>
                
                <button 
                  className="complete-btn"
                  onClick={() => handleCompleteJob(activeJob._id)}
                >
                  Complete Job
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-active-job">
            <p>No active job found</p>
            <button 
              className="create-job-btn"
              onClick={() => navigate('/locksmith/jobs/create')}
            >
              Create New Job
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={() => navigate('/locksmith/jobs')}>Job History</button>
        <button onClick={() => navigate('/locksmith/earnings')}>View Earnings</button>
      </div>
    </div>
  );
}

export default ServiceProviderDashboard; 