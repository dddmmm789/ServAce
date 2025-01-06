import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateJob() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const jobData = {
      customerName: fullName,
      phoneNumber,
      location: {
        address: serviceAddress,
        coordinates: {
          lat: 0,
          lng: 0
        }
      },
      status: 'pending'
    };

    console.log('Submitting job data:', jobData);

    try {
      const response = await fetch('http://localhost:3002/api/locksmith/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      if (result.success) {
        navigate('/locksmith/jobs');
      } else {
        setError(result.message || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Failed to create job. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Job</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Service Address</label>
          <input
            type="text"
            value={serviceAddress}
            onChange={(e) => setServiceAddress(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Job
        </button>
      </form>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify({ fullName, phoneNumber, serviceAddress }, null, 2)}
      </pre>
    </div>
  );
}

export default CreateJob; 