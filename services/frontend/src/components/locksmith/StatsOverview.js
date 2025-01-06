import React from 'react';

function StatsOverview({ stats }) {
  return (
    <div className="stats-overview">
      <div className="stat-card">
        <div className="stat-value">${stats.todayEarnings}</div>
        <div className="stat-label">Today's Earnings</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.completedToday}</div>
        <div className="stat-label">Jobs Completed</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.rating}⭐</div>
        <div className="stat-label">Rating</div>
      </div>
    </div>
  );
}

export default StatsOverview; 