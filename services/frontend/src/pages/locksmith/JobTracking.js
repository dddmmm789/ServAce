import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../../styles/tracking.css';

function JobTracking() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [locksmith, setLocksmith] = useState(null);
  const [journey, setJourney] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    floor: '',
    apartment: '',
    additionalInfo: ''
  });

  // Track customer's last view
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch(`http://localhost:3002/api/locksmith/jobs/${jobId}/track-view`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };
    trackPageView();
  }, [jobId]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job details
        const jobResponse = await fetch(`http://localhost:3002/api/locksmith/jobs/${jobId}`);
        const jobData = await jobResponse.json();
        setJob(jobData.job);

        // Fetch locksmith details
        const locksmithResponse = await fetch(`http://localhost:3002/api/locksmith/${jobData.job.locksmith.id}`);
        const locksmithData = await locksmithResponse.json();
        setLocksmith(locksmithData.locksmith);

        // Fetch reviews
        const reviewsResponse = await fetch(`http://localhost:3003/api/reviews/locksmith/${jobData.job.locksmith.id}/reviews`);
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load job details');
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  // Real-time tracking updates
  useEffect(() => {
    const trackingInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3006/api/journey/${jobId}`);
        const data = await response.json();
        setJourney(data.journey);
      } catch (error) {
        console.error('Error fetching tracking:', error);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(trackingInterval);
  }, [jobId]);

  const handleAddressUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/locksmith/jobs/${jobId}/update-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressDetails)
      });
      
      const data = await response.json();
      if (data.success) {
        setIsAddressModalOpen(false);
        setJob(data.job);
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!job) return <div className="not-found">Job not found</div>;

  return (
    <div className="tracking-container">
      {/* Locksmith Info Section */}
      <div className="locksmith-info">
        <img src={locksmith?.profileImage} alt="Locksmith" className="locksmith-image" />
        <div className="locksmith-details">
          <h2>{locksmith?.name}</h2>
          <div className="rating">
            ⭐ {locksmith?.rating} ({reviews.length} reviews)
          </div>
        </div>
      </div>

      {/* ETA Section */}
      <div className="eta-section">
        <h3>Estimated Time of Arrival</h3>
        <div className="eta-time">{journey?.estimatedArrival || 'Calculating...'}</div>
      </div>

      {/* Map Section */}
      <div className="map-container">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
          <GoogleMap
            center={journey?.currentLocation?.coordinates || job.location.coordinates}
            zoom={15}
            mapContainerClassName="map"
          >
            {journey?.currentLocation && (
              <Marker
                position={{
                  lat: journey.currentLocation.coordinates[1],
                  lng: journey.currentLocation.coordinates[0]
                }}
                icon={{
                  url: '/locksmith-marker.png',
                  scaledSize: { width: 40, height: 40 }
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Address Section */}
      <div className="address-section">
        <h3>Service Location</h3>
        <p>{job.location.address.formatted}</p>
        
        {job.addressDetails?.isConfirmed ? (
          <div className="confirmed-address">
            <p>✓ Address confirmed</p>
            <p>Floor: {job.addressDetails.floor}</p>
            <p>Apartment: {job.addressDetails.apartment}</p>
            <p>Additional Info: {job.addressDetails.additionalInfo}</p>
          </div>
        ) : (
          <button 
            className="update-address-btn"
            onClick={() => setIsAddressModalOpen(true)}
          >
            Update Address Details
          </button>
        )}
      </div>

      {/* Simple Modal */}
      {isAddressModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Address Details</h3>
            <input
              type="text"
              placeholder="Floor"
              value={addressDetails.floor}
              onChange={(e) => setAddressDetails({
                ...addressDetails,
                floor: e.target.value
              })}
            />
            <input
              type="text"
              placeholder="Apartment"
              value={addressDetails.apartment}
              onChange={(e) => setAddressDetails({
                ...addressDetails,
                apartment: e.target.value
              })}
            />
            <textarea
              placeholder="Additional Information"
              value={addressDetails.additionalInfo}
              onChange={(e) => setAddressDetails({
                ...addressDetails,
                additionalInfo: e.target.value
              })}
            />
            <div className="modal-actions">
              <button onClick={handleAddressUpdate}>Confirm</button>
              <button onClick={() => setIsAddressModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>Locksmith Reviews</h3>
        <div className="reviews-summary">
          <div className="average-rating">
            ⭐ {locksmith?.rating?.toFixed(1) || 'N/A'}
          </div>
          <button 
            className="view-reviews-btn"
            onClick={() => window.open(`/locksmith/${locksmith.id}/reviews`, '_blank')}
          >
            View {reviews.length} Reviews
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobTracking; 