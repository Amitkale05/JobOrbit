import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { Link } from 'react-router-dom';
import { getMyJobs, deleteJob } from '../../api/jobApi';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const LINKS = [
  { to: '/recruiter', label: 'Overview', end: true },
  { to: '/recruiter/jobs', label: 'My Jobs' },
  { to: '/recruiter/jobs/new', label: 'Post a Job' },
  { to: '/recruiter/applicants', label: 'Applicants' },
];

export default function ManageJobs() {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchJobs = (page = 0) => {
    setLoading(true);
    getMyJobs({ page, size: 8 }).then((res) => setData(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(0); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteJob(id);
      fetchJobs(data.pageNumber);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardShell title="Recruiter" links={LINKS}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">My Job Postings</h3>
          <p className="text-muted-orbit mb-0">All jobs you've created.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-orbit-primary">+ Post a job</Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : data.content.length === 0 ? (
        <div className="orbit-card p-5 text-center text-muted-orbit">
          You haven't posted any jobs yet. <Link to="/recruiter/jobs/new">Create your first one</Link>.
        </div>
      ) : (
        <div className="orbit-card p-3">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted-orbit small"><th>Title</th><th>Location</th><th>Type</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {data.content.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.jobType.replace('_', ' ')}</td>
                  <td>{job.status}</td>
                  <td className="text-end">
                    <Link to={`/recruiter/jobs/${job.id}/edit`} className="btn btn-sm btn-orbit-outline me-2">Edit</Link>
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
