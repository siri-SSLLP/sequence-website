import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout.jsx';
import { useData } from '../Context/DataContext.jsx';

const sections = [
  { to: '/products',       label: 'Products',          icon: '🏷️',  desc: 'Manage product catalogue',       key: 'products' },
  { to: '/new-launches',   label: 'New Launches',       icon: '🚀',  desc: 'Manage new launch products',     key: 'newLaunches' },
  { to: '/categories',     label: 'Categories',         icon: '📂',  desc: 'Manage parent & child categories', key: 'categories' },
  { to: '/category-icons', label: 'Category Icons',     icon: '🖼️',  desc: 'Manage category image mappings', key: 'categoryIcons' },
  { to: '/inspiration',    label: 'Inspiration Rooms',  icon: '✨',  desc: 'Manage room inspiration sections', key: 'inspiration' },
  { to: '/trending',       label: 'Trending',           icon: '🔥',  desc: 'Manage trending collections',    key: 'trending' },
  { to: '/themes',         label: 'Explore Themes',     icon: '🎨',  desc: 'Manage explore theme cards',     key: 'themes' },
  { to: '/settings',       label: 'Settings',           icon: '⚙️',  desc: 'Contact numbers & messages',     key: null },
];

function getCount(data, key) {
  if (!key) return null;
  const val = data[key];
  if (!val) return 0;
  if (Array.isArray(val)) return val.length;
  if (typeof val === 'object') return Object.keys(val).length;
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const data = useData();

  const totalProducts  = data.products.length;
  const totalLaunches  = data.newLaunches.length;
  const totalCats      = data.categories.length;
  const totalIcons     = Object.keys(data.categoryIcons || {}).length;

  return (
    <Layout title="Dashboard">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <h3>{totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-info">
            <h3>{totalLaunches}</h3>
            <p>New Launches</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <h3>{totalCats}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🖼️</div>
          <div className="stat-info">
            <h3>{totalIcons}</h3>
            <p>Category Icons</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div className="stat-info">
            <h3>{data.inspiration.length}</h3>
            <p>Inspiration Rooms</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <h3>{data.trending.length}</h3>
            <p>Trending Items</p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div>
          <h1>Quick Access</h1>
          <p>Jump to any section to manage data</p>
        </div>
      </div>

      <div className="quick-access-grid">
        {sections.map((s) => {
          const count = getCount(data, s.key);
          return (
            <div
              key={s.to}
              className="quick-card"
              onClick={() => navigate(s.to)}
            >
              <div className="quick-card-icon">{s.icon}</div>
              <div>
                <h4>
                  {s.label}
                  {count !== null && (
                    <span className="count-badge" style={{ marginLeft: '8px' }}>{count}</span>
                  )}
                </h4>
                <p>{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
