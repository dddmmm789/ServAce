import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Earnings() {
  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    jobs: []
  });
  const [timeframe, setTimeframe] = useState('week');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEarnings();
  }, [timeframe]);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get(`/api/locksmith/earnings?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEarnings(response.data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  return (
    <div className="earnings-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1>Earnings</h1>
      </header>

      <div className="earnings-overview">
        <div className="earnings-card main">
          <div className="amount">${(earnings[timeframe] / 100).toFixed(2)}</div>
          <div className="period">
            {timeframe === 'today' ? 'Today' : 
             timeframe === 'week' ? 'This Week' : 'This Month'}
          </div>
        </div>
      </div>

      <div className="timeframe-selector">
        <button 
          className={`timeframe-btn ${timeframe === 'today' ? 'active' : ''}`}
          onClick={() => setTimeframe('today')}
        >
          Today
        </button>
        <button 
          className={`timeframe-btn ${timeframe === 'week' ? 'active' : ''}`}
          onClick={() => setTimeframe('week')}
        >
          Week
        </button>
        <button 
          className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
          onClick={() => setTimeframe('month')}
        >
          Month
        </button>
      </div>

      <div className="earnings-list">
        <h2>Completed Jobs</h2>
        {earnings.jobs.map(job => (
          <div key={job._id} className="earning-item">
            <div className="job-info">
              <div className="service">{job.service}</div>
              <div className="date">{new Date(job.completedAt).toLocaleDateString()}</div>
            </div>
            <div className="amount">${(job.price.amount / 100).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Earnings; 