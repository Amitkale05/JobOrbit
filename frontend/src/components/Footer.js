import React from 'react';
import OrbitMark from './OrbitMark';

export default function Footer() {
  return (
    <footer className="orbit-footer">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <div className="d-flex align-items-center gap-2">
          <OrbitMark />
          <span className="text-white fw-semibold">JobOrbit</span>
        </div>
        <div>© {new Date().getFullYear()} JobOrbit · Smart Recruitment Platform · Developed by Aniket & Amit</div>
      </div>
    </footer>
  );
}
