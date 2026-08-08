import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, getAllJobsAdmin } from '../../api/adminApi';

const LINKS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/jobs', label: 'Manage Jobs' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, recruiters: 0, jobSeekers: 0, jobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllJobsAdmin({ page: 0, size: 1 })]).then(([usersRes, jobsRes]) => {
      const users = usersRes.data.data;
      setStats({
        users: users.length,
        recruiters: users.filter((u) => u.role === 'RECRUITER').length,
        jobSeekers: users.filter((u) => u.role === 'JOB_SEEKER').length,
        jobs: jobsRes.data.data.totalElements,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Admin" links={LINKS}>
      <h3 className="mb-1">Welcome, {user?.fullName?.split(' ')[0]} 👋</h3>
      <p className="text-muted-orbit mb-4">Platform-wide overview.</p>

      <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{loading ? '—' : stats.users}</div>
            <div className="stat-label">Total users</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{loading ? '—' : stats.recruiters}</div>
            <div className="stat-label">Recruiters</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{loading ? '—' : stats.jobSeekers}</div>
            <div className="stat-label">Job seekers</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="orbit-card stat-card">
            <div className="stat-value">{loading ? '—' : stats.jobs}</div>
            <div className="stat-label">Job postings</div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
