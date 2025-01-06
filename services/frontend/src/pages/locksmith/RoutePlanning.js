import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';

function RoutePlanning() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [route, setRoute] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    const response = await axios.get('/api/jobs/available');
    setJobs(response.data);
  };

  const handlePlanRoute = async () => {
    const response = await axios.post('/api/route/plan', {
      jobs: selectedJobs,
      startLocation: currentLocation,
      date: selectedDate
    });
    setRoute(response.data);
    calculateAndDisplayRoute();
  };

  return (
    <div className="route-planning">
      <div className="job-selection">
        <h2>Select Jobs for Route</h2>
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <input
              type="checkbox"
              onChange={(e) => handleJobSelection(job, e.checked)}
            />
            <div className="job-details">
              <h3>{job.serviceType}</h3>
              <p>{job.location.address}</p>
              <p>Est. Duration: {job.estimatedDuration} mins</p>
              <p>Expected Revenue: ${job.expectedRevenue}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="route-map">
        <GoogleMap
          center={defaultCenter}
          zoom={12}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      <div className="route-summary">
        <h2>Route Summary</h2>
        {route && (
          <>
            <p>Total Distance: {route.totalDistance} km</p>
            <p>Total Duration: {route.totalDuration} mins</p>
            <p>Fuel Expenses: ${route.fuelExpenses}</p>
            <p>Expected Revenue: ${route.expectedRevenue}</p>
            <p>Expected Profit: ${route.expectedProfit}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default RoutePlanning; 