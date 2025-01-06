import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/locksmith.css';

function JobHistory() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/locksmith/jobs', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      console.log('Raw API Response:', data);
      
      if (!data || !data.jobs) {
        setJobs([]);
        return;
      }

      // Sort jobs by creation date, newest first
      const sortedJobs = data.jobs.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      console.log('First job data:', sortedJobs[0]); // Log the first job's structure
      setJobs(sortedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/locksmith/jobs/${jobId}`);
  };

  const getFormattedAddress = (location) => {
    if (!location || !location.address) return 'Address not available';
    return location.address.formatted || 'Address not available';
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="job-history-container">
      <h1>Job History</h1>
      
      {jobs && jobs.length > 0 ? (
        <div className="jobs-list">
          {jobs.map(job => {
            console.log('Rendering job:', job); // Log each job as it's being rendered
            return (
              <div key={job._id} className="job-card">
                <div className="job-details">
                  <h3>{job.customerName || 'Unknown Customer'}</h3>
                  <p>{getFormattedAddress(job.location)}</p>
                  <p>Phone: {job.phoneNumber || 'N/A'}</p>
                  <p>Status: <span className={`status-${job.status}`}>{job.status}</span></p>
                  {job.createdAt && (
                    <p>Created: {new Date(job.createdAt).toLocaleDateString()}</p>
                  )}
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(job._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-jobs">
          <p>No jobs found</p>
        </div>
      )}
    </div>
  );
}

export default JobHistory; 