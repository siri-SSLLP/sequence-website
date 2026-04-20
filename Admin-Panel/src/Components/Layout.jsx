import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊', exact: true },
  { label: 'CATALOGUE', section: true },
  { to: '/products', label: 'Products', icon: '🏷️' },
  { to: '/new-launches', label: 'New Launches', icon: '🚀' },
  { label: 'CATEGORIES', section: true },
  { to: '/categories', label: 'Categories', icon: '📂' },
  { to: '/category-icons', label: 'Category Icons', icon: '🖼️' },
  { label: 'CONTENT', section: true },
  { to: '/inspiration', label: 'Inspiration', icon: '✨' },
  { to: '/trending', label: 'Trending', icon: '🔥' },
  { to: '/themes', label: 'Explore Themes', icon: '🎨' },
  { label: 'CONFIG', section: true },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>⬡ SEQUENCE</h2>
          <span>Admin Panel v1.0</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) => {
            if (item.section) {
              return <div key={i} className="nav-section-label">{item.label}</div>;
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="top-header">
          <h2 className="header-title">{title || 'Admin Panel'}</h2>
          <div className="header-right">
            <div className="admin-badge">
              <div className="dot" />
              <span>Admin</span>
            </div>
          </div>
        </header>
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
