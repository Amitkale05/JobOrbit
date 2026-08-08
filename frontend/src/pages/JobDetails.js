import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '../api/jobApi';
import { applyToJob } from '../api/applicationApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getJobById(id).then((res) => setJob(res.data.data)).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setApplying(true);
    setMessage(null);
    try {
      await applyToJob({ jobId: job.id, recruiterId: job.recruiterId, coverLetter });
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Could not submit application.' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading job…" />;
  if (!job) return <div className="container py-5 text-center">Job not found.</div>;

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="orbit-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h3 className="mb-1">{job.title}</h3>
                <div className="text-muted-orbit mb-2">{job.company?.name} · {job.location}</div>
              </div>
              <span className="job-type-chip">{job.jobType.replace('_', ' ')}</span>
            </div>
            <hr />
            <h6>Job description</h6>
            <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>
            {job.skillsRequired && (
              <>
                <h6>Skills required</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {job.skillsRequired.split(',').map((s) => (
                    <span key={s} className="job-type-chip">{s.trim()}</span>
                  ))}
                </div>
              </>
            )}
            <div className="row small text-muted-orbit">
              <div className="col-sm-4"><strong>Experience:</strong> {job.experienceRequired || 'Not specified'}</div>
              <div className="col-sm-4">
                <strong>Salary:</strong>{' '}
                {job.minSalary && job.maxSalary ? `₹${job.minSalary.toLocaleString()} - ₹${job.maxSalary.toLocaleString()}` : 'Not disclosed'}
              </div>
              <div className="col-sm-4"><strong>Status:</strong> {job.status}</div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {(!user || user.role === 'JOB_SEEKER') && (
            <div className="orbit-card p-4">
              <h6 className="mb-3">Apply for this role</h6>
              {message && <div className={`alert alert-${message.type} py-2 small`}>{message.text}</div>}
              <form onSubmit={handleApply}>
                <textarea
                  className="form-control mb-3"
                  rows={5}
                  placeholder="Add a short cover letter (optional)"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                <button className="btn btn-orbit-primary w-100" disabled={applying}>
                  {applying ? 'Submitting…' : user ? 'Apply now' : 'Log in to apply'}
                </button>
              </form>
            </div>
          )}

          <div className="orbit-card p-4 mt-3">
            <h6 className="mb-2">About {job.company?.name}</h6>
            <p className="small text-muted-orbit mb-1">{job.company?.industry}</p>
            <p className="small text-muted-orbit mb-0">{job.company?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
