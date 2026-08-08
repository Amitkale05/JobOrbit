import React from 'react';
import { Link } from 'react-router-dom';

const jobTypeLabel = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  INTERNSHIP: 'Internship',
  CONTRACT: 'Contract',
  REMOTE: 'Remote',
};

export default function JobCard({ job }) {
  const initials = (job.company?.name || 'JO').slice(0, 2).toUpperCase();

  return (
    <div className="orbit-card job-card d-flex gap-3 mb-3">
      <div className="company-badge">{initials}</div>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h5 className="mb-1">
              <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">{job.title}</Link>
            </h5>
            <div className="text-muted-orbit small mb-2">
              {job.company?.name} · {job.location}
            </div>
          </div>
          <span className="job-type-chip">{jobTypeLabel[job.jobType] || job.jobType}</span>
        </div>
        <p className="text-muted-orbit small mb-2" style={{ maxWidth: 640 }}>
          {job.description?.length > 160 ? job.description.slice(0, 160) + '…' : job.description}
        </p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="small text-muted-orbit">
            {job.minSalary && job.maxSalary
              ? `₹${job.minSalary.toLocaleString()} - ₹${job.maxSalary.toLocaleString()}`
              : 'Salary not disclosed'}
          </div>
          <Link to={`/jobs/${job.id}`} className="btn btn-orbit-outline btn-sm">View details</Link>
        </div>
      </div>
    </div>
  );
}
