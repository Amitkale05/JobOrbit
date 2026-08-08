import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrbitMark from './OrbitMark';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'RECRUITER') return '/recruiter';
    return '/jobseeker';
  };

  return (
    <nav className="orbit-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="orbit-brand">
          <OrbitMark />
          JobOrbit
        </Link>

        <div className="d-flex align-items-center gap-1">
          <NavLink to="/jobs" className="orbit-nav-link">Find Jobs</NavLink>
          {user && <NavLink to={dashboardPath()} className="orbit-nav-link">Dashboard</NavLink>}

          {!user && (
            <>
              <NavLink to="/login" className="orbit-nav-link">Log in</NavLink>
              <Link to="/register" className="btn btn-orbit-gold btn-sm ms-2">Get Started</Link>
            </>
          )}

          {user && (
            <div className="dropdown ms-2">
              <button
                className="btn btn-sm d-flex align-items-center gap-2 dropdown-toggle"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: 8 }}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.fullName?.split(' ')[0]}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><span className="dropdown-item-text small text-muted-orbit">{user.role}</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Log out</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
