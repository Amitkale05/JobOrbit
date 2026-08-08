import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../api/applicationApi';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/jobseeker', label: 'Overview', end: true },
  { to: '/jobseeker/search', label: 'Search Jobs' },
  { to: '/jobseeker/applications', label: 'My Applications' },
  { to: '/jobseeker/profile', label: 'Profile' },
];

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications({ page: 0, size: 5 })
      .then((res) => setApplications(res.data.data.content))
      .finally(() => setLoading(false));
  }, []);

  const counts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardShell title="Job Seeker" links={LINKS}>
      <h3 className="mb-1">Welcome back, {user?.fullName?.split(' ')[0]} 👋</h3>
      <p className="text-muted-orbit mb-4">Here's a snapshot of your job search.</p>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{applications.length}</div>
            <div className="stat-label">Recent applications</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{counts.SHORTLISTED || 0}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{counts.HIRED || 0}</div>
            <div className="stat-label">Hired</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{counts.REJECTED || 0}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      <div className="orbit-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Recent applications</h6>
          <Link to="/jobseeker/applications" className="small">View all</Link>
        </div>
        {loading ? (
          <p className="text-muted-orbit small">Loading…</p>
        ) : applications.length === 0 ? (
          <p className="text-muted-orbit small mb-0">
            You haven't applied to any jobs yet. <Link to="/jobseeker/search">Start searching</Link>.
          </p>
        ) : (
          <table className="table align-middle">
            <thead>
              <tr className="text-muted-orbit small"><th>Job ID</th><th>Applied</th><th>Status</th></tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id}>
                  <td>#{a.jobId}</td>
                  <td className="small">{new Date(a.appliedAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
