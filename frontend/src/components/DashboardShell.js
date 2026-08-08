import React from 'react';
import { NavLink } from 'react-router-dom';

export default function DashboardShell({ title, links, children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-md-3 col-lg-2 orbit-sidebar py-4 px-0">
          <h6 className="px-3 mb-3 text-muted-orbit text-uppercase small fw-bold">{title}</h6>
          <nav>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="col-md-9 col-lg-10 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
