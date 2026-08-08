import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { getAllJobsAdmin, deleteJobAdmin } from '../../api/adminApi';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const LINKS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/jobs', label: 'Manage Jobs' },
];

export default function ManageJobsAdmin() {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchJobs = (page = 0) => {
    setLoading(true);
    getAllJobsAdmin({ page, size: 8 }).then((res) => setData(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(0); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    setBusyId(id);
    try {
      await deleteJobAdmin(id);
      fetchJobs(data.pageNumber);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardShell title="Admin" links={LINKS}>
      <h3 className="mb-1">Manage Jobs</h3>
      <p className="text-muted-orbit mb-4">Every job posting across the platform.</p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="orbit-card p-3">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted-orbit small"><th>Title</th><th>Company</th><th>Location</th><th>Status</th><th>Recruiter ID</th><th></th></tr>
            </thead>
            <tbody>
              {data.content.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.company?.name}</td>
                  <td>{job.location}</td>
                  <td>{job.status}</td>
                  <td>#{job.recruiterId}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-danger" disabled={busyId === job.id} onClick={() => handleDelete(job.id)}>
                      {busyId === job.id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={fetchJobs} />
    </DashboardShell>
  );
}
