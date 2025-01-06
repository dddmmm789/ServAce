import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';

function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completion, setCompletion] = useState({
    totalAmount: '',
    platformFee: '',
    expenses: '',
    netIncome: ''
  });

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/locksmith/jobs/${jobId}`);
      setJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="job-detail">
        <h1>Job Details</h1>
        
        <div className="job-info">
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> {job.customerName}</p>
          <p><strong>Phone:</strong> {job.phoneNumber}</p>
          <p><strong>Address:</strong> {job.customerLocation?.address}</p>
          
          <h2>Service Information</h2>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Service Type:</strong> {job.serviceType || 'Not specified'}</p>
          <p><strong>Description:</strong> {job.description || 'No description provided'}</p>
          
          {/* Location information without map */}
          <h2>Location Information</h2>
          <p><strong>Customer Location:</strong> {job.customerLocation?.address}</p>
          <p><strong>Locksmith Location:</strong> {job.locksmithLocation?.address}</p>
        </div>

        {job.status === 'pending' && (
          <button 
            className="complete-btn"
            onClick={() => setIsCompleting(true)}
          >
            Complete Job
          </button>
        )}

        {isCompleting && (
          <form className="completion-form">
            <h2>Job Completion Details</h2>
            <div className="form-group">
              <label>Total Amount ($)</label>
              <input
                type="number"
                value={completion.totalAmount}
                onChange={(e) => setCompletion({
                  ...completion,
                  totalAmount: e.target.value,
                  platformFee: (e.target.value * 0.2).toFixed(2),
                  netIncome: (e.target.value * 0.8).toFixed(2)
                })}
              />
            </div>

            <div className="completion-summary">
              <p>Platform Fee (20%): ${completion.platformFee}</p>
              <p>Net Income: ${completion.netIncome}</p>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setIsCompleting(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Complete & Send Review Request
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default JobDetail; 