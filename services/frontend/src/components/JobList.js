import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function JobList() {
  const [searchType, setSearchType] = useState('phone');
  const [searchValue, setSearchValue] = useState('');
  const [jobType, setJobType] = useState('Emergency Service');
  const [urgency, setUrgency] = useState('urgent');
  const { token } = useAuth();
  const navigate = useNavigate();

  const createJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3002/api/locksmith/jobs/quick',
        {
          searchType,
          searchValue,
          type: jobType,
          urgency
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="job-list">
      <h2>Create New Job</h2>
      <form onSubmit={createJob}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="phone">Phone</option>
          <option value="address">Address</option>
        </select>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={searchType === 'phone' ? 'Phone Number' : 'Address'}
        />
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="Emergency Service">Emergency Service</option>
          <option value="Scheduled Service">Scheduled Service</option>
        </select>
        <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
        </select>
        <button type="submit">Create Job</button>
      </form>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
}

export default JobList; 