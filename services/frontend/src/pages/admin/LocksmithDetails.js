import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminMethods } from '../../services/api';

function LocksmithDetails() {
  const [locksmith, setLocksmith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocksmith = async () => {
      try {
        const data = await adminMethods.getLocksmithById(id);
        setLocksmith(data);
      } catch (error) {
        console.error('Error fetching locksmith:', error);
        setError('Failed to load locksmith details');
        if (error.response?.status === 401) {
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocksmith();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      setError('');
      await adminMethods.updateLocksmithStatus(id, newStatus);
      const updatedData = await adminMethods.getLocksmithById(id);
      setLocksmith(updatedData);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!locksmith) return <div>Locksmith not found</div>;

  return (
    <div className="admin-page">
      <header>
        <button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
        <h1>Locksmith Details</h1>
      </header>

      <div className="details-container">
        <section className="details-card">
          <h2>Basic Information</h2>
          <div className="details-grid">
            <div>
              <label>Name</label>
              <p>{locksmith.name}</p>
            </div>
            <div>
              <label>Email</label>
              <p>{locksmith.email}</p>
            </div>
            <div>
              <label>Phone</label>
              <p>{locksmith.phone}</p>
            </div>
            <div>
              <label>Status</label>
              <p>{locksmith.verificationStatus}</p>
            </div>
          </div>
        </section>

        <section className="actions-card">
          <h2>Actions</h2>
          <div className="button-group">
            <button
              onClick={() => handleStatusChange('verified')}
              disabled={locksmith.verificationStatus === 'verified'}
              className={`action-btn ${locksmith.verificationStatus === 'verified' ? 'disabled' : 'approve'}`}
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange('rejected')}
              disabled={locksmith.verificationStatus === 'rejected'}
              className={`action-btn ${locksmith.verificationStatus === 'rejected' ? 'disabled' : 'reject'}`}
            >
              Reject
            </button>
            <button
              onClick={() => handleStatusChange('suspended')}
              disabled={locksmith.verificationStatus === 'suspended'}
              className={`action-btn ${locksmith.verificationStatus === 'suspended' ? 'disabled' : 'suspend'}`}
            >
              Suspend
            </button>
            <button
              onClick={() => navigate(`/admin/locksmiths/${id}/reviews`)}
              className="view-reviews-btn"
            >
              View Reviews
            </button>
          </div>
        </section>

        {/* Add more sections as needed for documents, profile info, etc. */}
      </div>
    </div>
  );
}

export default LocksmithDetails; 