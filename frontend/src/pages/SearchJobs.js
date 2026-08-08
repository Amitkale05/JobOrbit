import React, { useEffect, useState } from 'react';
import { searchJobs } from '../api/jobApi';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'REMOTE'];

export default function SearchJobs() {
  const [filters, setFilters] = useState({ keyword: '', location: '', jobType: '' });
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (pageNum = page) => {
    setLoading(true);
    try {
      const params = { page: pageNum, size: 6 };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.location) params.location = filters.location;
      if (filters.jobType) params.jobType = filters.jobType;
      const res = await searchJobs(params);
      setData(res.data.data);
    } catch (err) {
      // keep previous data on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchJobs(0);
  };

  const handlePageChange = (p) => {
    setPage(p);
    fetchJobs(p);
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <div className="section-eyebrow">Find Jobs</div>
        <h2>Search open roles</h2>
      </div>

      <form className="orbit-card p-3 mb-4" onSubmit={handleSearch}>
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small">Keyword</label>
            <input className="form-control" placeholder="Job title, skill…"
                   value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Location</label>
            <input className="form-control" placeholder="City"
                   value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Job type</label>
            <select className="form-select" value={filters.jobType}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
              <option value="">All types</option>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-orbit-primary w-100">Search</button>
          </div>
        </div>
      </form>

      {loading ? (
        <LoadingSpinner label="Fetching jobs…" />
      ) : data.content.length === 0 ? (
        <div className="orbit-card p-5 text-center text-muted-orbit">
          No jobs match your search yet. Try different filters.
        </div>
      ) : (
        <>
          {data.content.map((job) => <JobCard key={job.id} job={job} />)}
          <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
