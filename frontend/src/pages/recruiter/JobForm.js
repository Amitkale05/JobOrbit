import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { useNavigate, useParams } from 'react-router-dom';
import { createJob, updateJob, getJobById, getAllCompanies, createCompany } from '../../api/jobApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const LINKS = [
  { to: '/recruiter', label: 'Overview', end: true },
  { to: '/recruiter/jobs', label: 'My Jobs' },
  { to: '/recruiter/jobs/new', label: 'Post a Job' },
  { to: '/recruiter/applicants', label: 'Applicants' },
];

const EMPTY_FORM = {
  title: '', description: '', location: '', jobType: 'FULL_TIME',
  experienceRequired: '', minSalary: '', maxSalary: '', skillsRequired: '', companyId: '',
};

export default function JobForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [companies, setCompanies] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCompanies = () => getAllCompanies().then((res) => setCompanies(res.data.data));

  useEffect(() => {
    loadCompanies();
    if (isEdit) {
      getJobById(id).then((res) => {
        const job = res.data.data;
        setForm({
          title: job.title, description: job.description, location: job.location, jobType: job.jobType,
          experienceRequired: job.experienceRequired || '', minSalary: job.minSalary || '', maxSalary: job.maxSalary || '',
          skillsRequired: job.skillsRequired || '', companyId: job.company?.id || '',
        });
      }).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleQuickAddCompany = async () => {
    if (!newCompanyName.trim()) return;
    const res = await createCompany({ name: newCompanyName });
    setNewCompanyName('');
    await loadCompanies();
    setForm({ ...form, companyId: res.data.data.id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        minSalary: form.minSalary ? Number(form.minSalary) : null,
        maxSalary: form.maxSalary ? Number(form.maxSalary) : null,
        companyId: Number(form.companyId),
      };
      if (isEdit) await updateJob(id, payload);
      else await createJob(payload);
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save job. Please check all fields.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardShell title="Recruiter" links={LINKS}>
      <h3 className="mb-1">{isEdit ? 'Update Job' : 'Post a New Job'}</h3>
      <p className="text-muted-orbit mb-4">{isEdit ? 'Edit the details below.' : 'Fill in the details to publish a new opening.'}</p>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form className="orbit-card p-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label small">Job title</label>
            <input className="form-control" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Job type</label>
            <select className="form-select" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label small">Company</label>
            <div className="d-flex gap-2">
              <select className="form-select" required value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
                <option value="">Select company</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="d-flex gap-2 mt-2">
              <input className="form-control form-control-sm" placeholder="New company name"
                     value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} />
              <button type="button" className="btn btn-sm btn-orbit-outline" onClick={handleQuickAddCompany}>Add</button>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label small">Location</label>
            <input className="form-control" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="col-md-4">
            <label className="form-label small">Experience required</label>
            <input className="form-control" placeholder="e.g. 2-4 years" value={form.experienceRequired}
                   onChange={(e) => setForm({ ...form, experienceRequired: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Min salary (₹/yr)</label>
            <input type="number" className="form-control" value={form.minSalary} onChange={(e) => setForm({ ...form, minSalary: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Max salary (₹/yr)</label>
            <input type="number" className="form-control" value={form.maxSalary} onChange={(e) => setForm({ ...form, maxSalary: e.target.value })} />
          </div>

          <div className="col-12">
            <label className="form-label small">Skills required (comma-separated)</label>
            <input className="form-control" placeholder="Java, Spring Boot, React"
                   value={form.skillsRequired} onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })} />
          </div>

          <div className="col-12">
            <label className="form-label small">Job description</label>
            <textarea className="form-control" rows={6} required value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        <button className="btn btn-orbit-primary mt-4" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update job' : 'Publish job'}
        </button>
      </form>
    </DashboardShell>
  );
}
