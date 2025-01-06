import React from 'react';

function StarRating({ value, onChange }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? 'filled' : ''}`}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating; 