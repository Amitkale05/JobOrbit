import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { getApplicationsForRecruiter, updateApplicationStatus } from '../../api/applicationApi';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApplicantProfileModal from '../../components/ApplicantProfileModal';

const LINKS = [
  { to: '/recruiter', label: 'Overview', end: true },
  { to: '/recruiter/jobs', label: 'My Jobs' },
  { to: '/recruiter/jobs/new', label: 'Post a Job' },
  { to: '/recruiter/applicants', label: 'Applicants' },
];

const STATUS_OPTIONS = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'HIRED'];

export default function ViewApplicants() {
  const [statusFilter, setStatusFilter] = useState('');
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [viewingApplicant, setViewingApplicant] = useState(null); // holds the application row being viewed

  const fetchApplicants = (page = 0) => {
    setLoading(true);
    const params = { page, size: 8 };
    if (statusFilter) params.status = statusFilter;
    getApplicationsForRecruiter(params).then((res) => setData(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchApplicants(0); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await updateApplicationStatus(id, status);
      fetchApplicants(data.pageNumber);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardShell title="Recruiter" links={LINKS}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h3 className="mb-1">Applicants</h3>
          <p className="text-muted-orbit mb-0">Review and move candidates through your pipeline.</p>
        </div>
        <select className="form-select" style={{ maxWidth: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.concat('WITHDRAWN').map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : data.content.length === 0 ? (
        <div className="orbit-card p-5 text-center text-muted-orbit">No applicants found for this filter.</div>
      ) : (
        <div className="orbit-card p-3">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted-orbit small">
                <th>Job ID</th><th>Applicant ID</th><th>Applied</th><th>Status</th><th>Profile</th><th>Update</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((a) => (
                <tr key={a.id}>
                  <td>#{a.jobId}</td>
                  <td>#{a.applicantId}</td>
                  <td className="small">{new Date(a.appliedAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    <button className="btn btn-sm btn-orbit-outline" onClick={() => setViewingApplicant(a)}>
                      View Profile
                    </button>
                  </td>
                  <td>
                    {a.status !== 'WITHDRAWN' && (
                      <select
                        className="form-select form-select-sm"
                        style={{ maxWidth: 160 }}
                        disabled={busyId === a.id}
                        value={a.status}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={fetchApplicants} />

      {viewingApplicant && (
        <ApplicantProfileModal
          applicantId={viewingApplicant.applicantId}
          coverLetter={viewingApplicant.coverLetter}
          onClose={() => setViewingApplicant(null)}
        />
      )}
    </DashboardShell>
  );
}
