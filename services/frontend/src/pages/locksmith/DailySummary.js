import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';

function DailySummary() {
  const [summary, setSummary] = useState({
    date: new Date().toLocaleDateString(),
    jobs: [],
    totals: {
      revenue: 0,
      platformFees: 0,
      expenses: 0,
      netIncome: 0
    }
  });

  useEffect(() => {
    fetchDailySummary();
  }, []);

  const fetchDailySummary = async () => {
    try {
      const response = await axios.get('/api/locksmith/daily-summary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  return (
    <Layout title="Daily Summary">
      <div className="daily-summary">
        <div className="summary-header">
          <h2>{summary.date}</h2>
          <div className="totals-grid">
            <div className="total-card">
              <span className="label">Total Revenue</span>
              <span className="value">${summary.totals.revenue.toFixed(2)}</span>
            </div>
            <div className="total-card">
              <span className="label">Platform Fees</span>
              <span className="value">${summary.totals.platformFees.toFixed(2)}</span>
            </div>
            <div className="total-card">
              <span className="label">Expenses</span>
              <span className="value">${summary.totals.expenses.toFixed(2)}</span>
            </div>
            <div className="total-card highlight">
              <span className="label">Net Income</span>
              <span className="value">${summary.totals.netIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="jobs-list">
          <h3>Completed Jobs</h3>
          {summary.jobs.map(job => (
            <div key={job._id} className="job-card">
              <div className="job-info">
                <h4>{job.type}</h4>
                <p>{job.address}</p>
                <p className="time">{new Date(job.completedAt).toLocaleTimeString()}</p>
              </div>
              <div className="job-amounts">
                <p>Revenue: ${job.totalAmount}</p>
                <p>Platform Fee: ${job.platformFee}</p>
                <p>Expenses: ${job.expenses}</p>
                <p className="net">Net: ${job.netIncome}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="end-day-btn" onClick={() => window.print()}>
          Print Summary
        </button>
      </div>
    </Layout>
  );
}

export default DailySummary; 