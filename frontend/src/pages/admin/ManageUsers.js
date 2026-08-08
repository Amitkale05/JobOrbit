import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { getAllUsers, updateUserStatus } from '../../api/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const LINKS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/jobs', label: 'Manage Jobs' },
];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');

  const load = () => {
    setLoading(true);
    getAllUsers().then((res) => setUsers(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (u) => {
    setBusyId(u.id);
    try {
      await updateUserStatus(u.id, !u.enabled);
      load();
    } finally {
      setBusyId(null);
    }
  };

  const filtered = roleFilter ? users.filter((u) => u.role === roleFilter) : users;

  return (
    <DashboardShell title="Admin" links={LINKS}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="mb-1">Manage Users</h3>
          <p className="text-muted-orbit mb-0">All job seekers, recruiters, and admins on the platform.</p>
        </div>
        <select className="form-select" style={{ maxWidth: 200 }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option value="JOB_SEEKER">Job Seeker</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="orbit-card p-3">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted-orbit small"><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className={`status-chip ${u.enabled ? 'status-SHORTLISTED' : 'status-REJECTED'}`}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className={`btn btn-sm ${u.enabled ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      disabled={busyId === u.id || u.role === 'ADMIN'}
                      onClick={() => handleToggle(u)}
                    >
                      {busyId === u.id ? '…' : u.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
