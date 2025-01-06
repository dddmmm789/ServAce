import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LocksmithApprovals() {
  const [locksmiths, setLocksmiths] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocksmiths();
  }, [filter]);

  const fetchLocksmiths = async () => {
    try {
      const response = await axios.get(`/api/admin/locksmiths?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setLocksmiths(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locksmiths:', error);
    }
  };

  const handleStatusUpdate = async (locksmithId, status) => {
    try {
      await axios.put(
        `/api/admin/locksmiths/${locksmithId}/status`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      fetchLocksmiths();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="admin-page">
      <div className="filter-tabs">
        <button 
          className={`tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button 
          className={`tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      <div className="locksmith-list">
        {locksmiths.map(locksmith => (
          <div key={locksmith._id} className="locksmith-card">
            <div className="locksmith-info">
              <h3>{locksmith.businessName}</h3>
              <p>Name: {locksmith.name}</p>
              <p>Phone: {locksmith.phone}</p>
              <p>License: {locksmith.licenseNumber}</p>
              <div className="document-links">
                <a href={locksmith.idProofUrl} target="_blank">View ID Proof</a>
                <a href={locksmith.licenseProofUrl} target="_blank">View License</a>
              </div>
            </div>
            
            {filter === 'pending' && (
              <div className="action-buttons">
                <button 
                  className="approve-btn"
                  onClick={() => handleStatusUpdate(locksmith._id, 'approved')}
                >
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleStatusUpdate(locksmith._id, 'rejected')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocksmithApprovals; 