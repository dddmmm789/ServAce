import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../../components/StarRating';

function ReviewRequest() {
  const { jobId } = useParams();
  const [review, setReview] = useState({
    rating: 0,
    comment: '',
    submitted: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reviews/${jobId}`, {
        rating: review.rating,
        comment: review.comment
      });
      setReview({ ...review, submitted: true });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (review.submitted) {
    return (
      <div className="review-success">
        <div className="success-card">
          <div className="success-icon">✨</div>
          <h1>Thank You!</h1>
          <p>Your feedback helps us improve our service.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-request">
      <div className="review-card">
        <h1>How was your experience?</h1>
        <form onSubmit={handleSubmit}>
          <div className="rating-section">
            <StarRating
              value={review.rating}
              onChange={(rating) => setReview({ ...review, rating })}
            />
          </div>

          <div className="comment-section">
            <label>Additional Comments</label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              placeholder="Tell us about your experience..."
              rows={4}
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewRequest; 