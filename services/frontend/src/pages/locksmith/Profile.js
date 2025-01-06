import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/locksmith.css';

function Profile() {
  const [profile, setProfile] = useState({
    // Application Info
    applicationStatus: '',
    submittedAt: '',
    verifiedAt: '',
    
    // Personal Info
    name: '',
    email: '',
    phone: '',
    
    // Business Info
    businessName: '',
    businessAddress: '',
    serviceArea: '',
    
    // Services
    services: {
      lockout: false,
      installation: false,
      repair: false,
      emergency: false,
      rekey: false
    },
    
    // Documents
    documents: [
      { type: 'businessLicense', status: '', url: '' },
      { type: 'insurance', status: '', url: '' },
      { type: 'certification', status: '', url: '' },
      { type: 'idCard', status: '', url: '' }
    ],
    
    // Stats
    rating: 0,
    jobsCompleted: 0,
    reviewCount: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/locksmith/profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleEnterLocksmithMode = async () => {
    try {
      const response = await fetch('/api/locksmith/enter-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      // Open locksmith mode in new tab
      window.open(`/locksmith/dashboard?token=${data.token}`, '_blank');
    } catch (error) {
      console.error('Failed to enter locksmith mode:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Locksmith Profile</h1>
        <div className="application-status" style={{ color: getStatusColor(profile.applicationStatus) }}>
          Status: {profile.applicationStatus}
        </div>
      </header>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{profile.rating.toFixed(1)}</span>
          <span className="stat-label">Rating</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{profile.jobsCompleted}</span>
          <span className="stat-label">Jobs Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{profile.reviewCount}</span>
          <span className="stat-label">Reviews</span>
        </div>
      </div>

      <div className="profile-sections">
        <section className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name</label>
              <p>{profile.name}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{profile.email}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{profile.phone}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Business Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Business Name</label>
              <p>{profile.businessName}</p>
            </div>
            <div className="info-item">
              <label>Business Address</label>
              <p>{profile.businessAddress}</p>
            </div>
            <div className="info-item">
              <label>Service Area</label>
              <p>{profile.serviceArea}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Services</h2>
          <div className="services-grid">
            {Object.entries(profile.services).map(([service, isOffered]) => (
              <div key={service} className={`service-item ${isOffered ? 'offered' : ''}`}>
                <span className="service-name">
                  {service.charAt(0).toUpperCase() + service.slice(1)}
                </span>
                <span className="service-status">
                  {isOffered ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>Documents</h2>
          <div className="documents-grid">
            {profile.documents.map((doc) => (
              <div key={doc.type} className="document-item">
                <div className="document-header">
                  <span className="document-type">
                    {doc.type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`document-status ${doc.status}`}>
                    {doc.status}
                  </span>
                </div>
                {doc.url && (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="view-document">
                    View Document
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {profile.applicationStatus === 'verified' && (
          <button 
            onClick={handleEnterLocksmithMode}
            className="enter-locksmith-mode-btn"
          >
            Enter Locksmith Mode
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile; 