import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/locksmith/daily-summary', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching summary:', error);
        if (error.response?.status === 401) {
          logout();
          navigate('/');
        }
      }
    };

    fetchSummary();
  }, [token, logout, navigate]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {summary && (
        <div>
          <h2>Today's Summary</h2>
          <div>Revenue: ${summary.totals.revenue}</div>
          <div>Platform Fees: ${summary.totals.platformFees}</div>
          <div>Expenses: ${summary.totals.expenses}</div>
          <div>Net Income: ${summary.totals.netIncome}</div>
          
          <h3>Recent Jobs</h3>
          {summary.jobs.map(job => (
            <div key={job._id} className="job-card">
              <div>Type: {job.type}</div>
              <div>Status: {job.status}</div>
              <div>Created: {new Date(job.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => navigate('/jobs')}>View All Jobs</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard; 