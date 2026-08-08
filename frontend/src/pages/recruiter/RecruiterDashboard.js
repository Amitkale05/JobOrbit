import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { useAuth } from '../../context/AuthContext';
import { getMyJobs } from '../../api/jobApi';
import { getApplicationsForRecruiter } from '../../api/applicationApi';
import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/recruiter', label: 'Overview', end: true },
  { to: '/recruiter/jobs', label: 'My Jobs' },
  { to: '/recruiter/jobs/new', label: 'Post a Job' },
  { to: '/recruiter/applicants', label: 'Applicants' },
];

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobCount, setJobCount] = useState(0);
  const [appCount, setAppCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyJobs({ page: 0, size: 1 }),
      getApplicationsForRecruiter({ page: 0, size: 1 }),
    ]).then(([jobsRes, appsRes]) => {
      setJobCount(jobsRes.data.data.totalElements);
      setAppCount(appsRes.data.data.totalElements);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Recruiter" links={LINKS}>
      <h3 className="mb-1">Welcome, {user?.fullName?.split(' ')[0]} 👋</h3>
      <p className="text-muted-orbit mb-4">Manage your job postings and applicants.</p>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{loading ? '—' : jobCount}</div>
            <div className="stat-label">Active job postings</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{loading ? '—' : appCount}</div>
            <div className="stat-label">Total applications received</div>
          </div>
        </div>
      </div>

      <div className="orbit-card p-4 d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">Ready to hire?</h6>
          <p className="text-muted-orbit small mb-0">Post a new job in under a minute.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-orbit-gold">Post a job</Link>
      </div>
    </DashboardShell>
  );
}
