import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

function AdminDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Pending Approvals',
      description: 'Review new and suspended locksmith applications',
      icon: '👥',
      path: '/admin/locksmiths?status=pending'
    },
    {
      title: 'Active Locksmiths',
      description: 'View and manage active locksmiths',
      icon: '✅',
      path: '/admin/locksmiths?status=verified'
    },
    {
      title: 'Rejected Applications',
      description: 'View rejected applications',
      icon: '❌',
      path: '/admin/locksmiths?status=rejected'
    },
    {
      title: 'Suspended Locksmiths',
      description: 'View suspended locksmiths',
      icon: '⏸️',
      path: '/admin/locksmiths?status=suspended'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className="menu-card" 
            onClick={() => navigate(item.path)}
          >
            <div className="menu-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div className="admin-actions">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard; 