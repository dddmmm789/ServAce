import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RequestService() {
  const [location, setLocation] = useState('');
  const [service, setService] = useState('lockout');
  const [notes, setNotes] = useState('');

  const serviceTypes = [
    { id: 'lockout', label: '🔒 Lockout Service' },
    { id: 'rekey', label: '🔑 Rekey Locks' },
    { id: 'repair', label: '🛠️ Lock Repair' },
    { id: 'install', label: '⚡ New Installation' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Create job through job service
  };

  return (
    <div className="request-service">
      <h1>Request a Locksmith</h1>
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label>Service Type</label>
          <div className="service-options">
            {serviceTypes.map(type => (
              <button
                key={type.id}
                type="button"
                className={`service-option ${service === type.id ? 'selected' : ''}`}
                onClick={() => setService(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="Enter your address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="button" className="location-btn">
            📍 Use Current Location
          </button>
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            placeholder="Any specific details about your situation..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Find Locksmith Now
        </button>
      </form>
    </div>
  );
}

export default RequestService; 