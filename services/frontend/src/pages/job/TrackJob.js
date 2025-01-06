import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TrackJob() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [locksmith, setLocksmith] = useState(null);
  const [eta, setEta] = useState(null);

  useEffect(() => {
    // TODO: Fetch job details and locksmith info
  }, [jobId]);

  return (
    <div className="track-job">
      {job && (
        <>
          <div className="status-card">
            <h2>Your Locksmith is {job.status === 'assigned' ? 'on the way!' : 'arriving soon!'}</h2>
            {eta && <p className="eta">ETA: {eta} minutes</p>}
          </div>

          {locksmith && (
            <div className="locksmith-card">
              <img src={locksmith.photo} alt={locksmith.name} className="locksmith-photo" />
              <div className="locksmith-info">
                <h3>{locksmith.name}</h3>
                <p className="rating">⭐ {locksmith.rating} ({locksmith.reviewCount} reviews)</p>
                <button className="contact-btn">📞 Call Locksmith</button>
              </div>
            </div>
          )}

          <div className="job-details">
            <h3>Job Details</h3>
            <p>Service: {job.service}</p>
            <p>Location: {job.location.address.formatted}</p>
            <p>Notes: {job.notes}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default TrackJob; 