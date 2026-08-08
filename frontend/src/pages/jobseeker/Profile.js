import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  getMyProfile, updateProfile, uploadResume,
  addEducation, deleteEducation, addExperience, deleteExperience, addSkill, deleteSkill,
} from '../../api/userApi';

const LINKS = [
  { to: '/jobseeker', label: 'Overview', end: true },
  { to: '/jobseeker/search', label: 'Search Jobs' },
  { to: '/jobseeker/applications', label: 'My Applications' },
  { to: '/jobseeker/profile', label: 'Profile' },
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [eduForm, setEduForm] = useState({ institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' });
  const [expForm, setExpForm] = useState({ companyName: '', jobTitle: '', startDate: '', endDate: '', currentlyWorking: false, description: '' });
  const [skillForm, setSkillForm] = useState({ name: '', proficiency: 'INTERMEDIATE' });

  const load = () => {
    setLoading(true);
    getMyProfile().then((res) => setProfile(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await updateProfile(profile);
      setProfile(res.data.data);
      setMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await uploadResume(formData);
    load();
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    await addEducation(eduForm);
    setEduForm({ institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' });
    load();
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    await addExperience(expForm);
    setExpForm({ companyName: '', jobTitle: '', startDate: '', endDate: '', currentlyWorking: false, description: '' });
    load();
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    await addSkill(skillForm);
    setSkillForm({ name: '', proficiency: 'INTERMEDIATE' });
    load();
  };

  if (loading || !profile) return <LoadingSpinner label="Loading profile…" />;

  return (
    <DashboardShell title="Job Seeker" links={LINKS}>
      <h3 className="mb-1">My Profile</h3>
      <p className="text-muted-orbit mb-4">Keep this up to date - recruiters see this when you apply.</p>

      {message && <div className={`alert alert-${message.type} py-2`}>{message.text}</div>}

      <div className="orbit-card p-4 mb-4">
        <h6 className="mb-3">Basic details</h6>
        <form onSubmit={handleSaveProfile}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small">Full name</label>
              <input className="form-control" value={profile.fullName || ''}
                     onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Phone</label>
              <input className="form-control" value={profile.phone || ''}
                     onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Headline</label>
              <input className="form-control" placeholder="e.g. Java Full Stack Developer"
                     value={profile.headline || ''} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Location</label>
              <input className="form-control" value={profile.location || ''}
                     onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label small">Summary</label>
              <textarea className="form-control" rows={3} value={profile.summary || ''}
                        onChange={(e) => setProfile({ ...profile, summary: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-orbit-primary mt-3" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
      </div>

      <div className="orbit-card p-4 mb-4">
        <h6 className="mb-3">Resume</h6>
        {profile.resumeFileName && (
          <p className="small text-muted-orbit">Current resume: {profile.resumeFileName}</p>
        )}
        <input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
      </div>

      <div className="orbit-card p-4 mb-4">
        <h6 className="mb-3">Education</h6>
        {profile.education?.map((edu) => (
          <div key={edu.id} className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-2">
            <div>
              <div className="fw-semibold">{edu.degree} - {edu.institution}</div>
              <div className="small text-muted-orbit">{edu.fieldOfStudy} · {edu.startYear} - {edu.endYear || 'Present'}</div>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteEducation(edu.id); load(); }}>Remove</button>
          </div>
        ))}
        <form onSubmit={handleAddEducation} className="row g-2 mt-3">
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Institution" required
            value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Degree" required
            value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control form-control-sm" placeholder="Field" 
            value={eduForm.fieldOfStudy} onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })} /></div>
          <div className="col-md-1"><input type="number" className="form-control form-control-sm" placeholder="Start"
            value={eduForm.startYear} onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })} /></div>
          <div className="col-md-1"><input type="number" className="form-control form-control-sm" placeholder="End"
            value={eduForm.endYear} onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })} /></div>
          <div className="col-md-1"><button className="btn btn-sm btn-orbit-primary w-100">Add</button></div>
        </form>
      </div>

      <div className="orbit-card p-4 mb-4">
        <h6 className="mb-3">Experience</h6>
        {profile.experience?.map((exp) => (
          <div key={exp.id} className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-2">
            <div>
              <div className="fw-semibold">{exp.jobTitle} - {exp.companyName}</div>
              <div className="small text-muted-orbit">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</div>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteExperience(exp.id); load(); }}>Remove</button>
          </div>
        ))}
        <form onSubmit={handleAddExperience} className="row g-2 mt-3">
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Company" required
            value={expForm.companyName} onChange={(e) => setExpForm({ ...expForm, companyName: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Job title" required
            value={expForm.jobTitle} onChange={(e) => setExpForm({ ...expForm, jobTitle: e.target.value })} /></div>
          <div className="col-md-2"><input type="date" className="form-control form-control-sm"
            value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} /></div>
          <div className="col-md-2"><input type="date" className="form-control form-control-sm" disabled={expForm.currentlyWorking}
            value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} /></div>
          <div className="col-md-1 d-flex align-items-center">
            <input type="checkbox" className="form-check-input me-1" checked={expForm.currentlyWorking}
              onChange={(e) => setExpForm({ ...expForm, currentlyWorking: e.target.checked })} />
            <label className="small">Current</label>
          </div>
          <div className="col-md-1"><button className="btn btn-sm btn-orbit-primary w-100">Add</button></div>
          <div className="col-12"><textarea className="form-control form-control-sm" placeholder="Description" rows={2}
            value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} /></div>
        </form>
      </div>

      <div className="orbit-card p-4">
        <h6 className="mb-3">Skills</h6>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {profile.skills?.map((s) => (
            <span key={s.id} className="job-type-chip d-flex align-items-center gap-2">
              {s.name} ({s.proficiency})
              <button className="btn-close btn-close-sm" style={{ fontSize: '0.6rem' }}
                onClick={async () => { await deleteSkill(s.id); load(); }} />
            </span>
          ))}
        </div>
        <form onSubmit={handleAddSkill} className="d-flex gap-2">
          <input className="form-control form-control-sm" placeholder="Skill name" style={{ maxWidth: 220 }}
                 value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
          <select className="form-select form-select-sm" style={{ maxWidth: 160 }}
                  value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
          <button className="btn btn-sm btn-orbit-primary">Add skill</button>
        </form>
      </div>
    </DashboardShell>
  );
}
