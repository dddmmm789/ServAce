import React from 'react';
import { useNavigate } from 'react-router-dom';

function Layout({ children, showBack = true, title }) {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <header className="page-header">
        {showBack && (
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
        )}
        <h1>{title}</h1>
      </header>
      <main className="page-content">
        {children}
      </main>
    </div>
  );
}

export default Layout; 