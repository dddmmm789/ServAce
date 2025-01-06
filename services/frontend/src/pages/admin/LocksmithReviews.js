import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminMethods } from '../../services/api';

function LocksmithReviews() {
  const [locksmith, setLocksmith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocksmith();
  }, [id]);

  const fetchLocksmith = async () => {
    try {
      const data = await adminMethods.getLocksmithById(id);
      setLocksmith(data);
    } catch (error) {
      setError('Failed to load locksmith data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReviews = async () => {
    try {
      setError('');
      await adminMethods.generateTestReviews(id);
      await fetchLocksmith();
    } catch (error) {
      console.error('Failed to generate reviews:', error);
      setError('Failed to generate reviews: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!locksmith) return <div>Locksmith not found</div>;

  return (
    <div className="admin-page">
      <header>
        <button onClick={() => navigate(`/admin/locksmiths/${id}`)}>
          Back to Locksmith Details
        </button>
        <h1>Reviews for {locksmith.name}</h1>
      </header>

      <div className="reviews-container">
        <div className="reviews-header">
          <h2>Reviews ({locksmith.reviews.length})</h2>
          <button 
            onClick={handleGenerateReviews}
            className="generate-reviews-btn"
          >
            Generate Test Reviews
          </button>
        </div>

        <div className="reviews-grid">
          {locksmith.reviews.length === 0 ? (
            <div className="no-data">No reviews yet</div>
          ) : (
            locksmith.reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <span className="rating">★ {review.rating}</span>
                  <span className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
                {review.response && (
                  <div className="review-response">
                    <h4>Locksmith Response:</h4>
                    <p>{review.response.text}</p>
                    <span className="response-date">
                      {new Date(review.response.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default LocksmithReviews; 