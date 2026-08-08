import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { getMyApplications, withdrawApplication } from '../../api/applicationApi';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const LINKS = [
  { to: '/jobseeker', label: 'Overview', end: true },
  { to: '/jobseeker/search', label: 'Search Jobs' },
  { to: '/jobseeker/applications', label: 'My Applications' },
  { to: '/jobseeker/profile', label: 'Profile' },
];

export default function MyApplications() {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchApplications = (page = 0) => {
    setLoading(true);
    getMyApplications({ page, size: 8 })
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApplications(0); }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    setBusyId(id);
    try {
      await withdrawApplication(id);
      fetchApplications(data.pageNumber);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardShell title="Job Seeker" links={LINKS}>
      <h3 className="mb-1">My Applications</h3>
      <p className="text-muted-orbit mb-4">Track the status of every job you've applied to.</p>

      {loading ? (
        <LoadingSpinner />
      ) : data.content.length === 0 ? (
        <div className="orbit-card p-5 text-center text-muted-orbit">You haven't applied to any jobs yet.</div>
      ) : (
        <div className="orbit-card p-3">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted-orbit small">
                <th>Job ID</th><th>Applied on</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((a) => (
                <tr key={a.id}>
                  <td>#{a.jobId}</td>
                  <td className="small">{new Date(a.appliedAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td className="text-end">
                    {a.status === 'APPLIED' && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={busyId === a.id}
                        onClick={() => handleWithdraw(a.id)}
                      >
                        {busyId === a.id ? 'Withdrawing…' : 'Withdraw'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={fetchApplications} />
    </DashboardShell>
  );
}
