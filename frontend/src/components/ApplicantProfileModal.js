import React, { useEffect, useState } from 'react';
import { getCandidateProfile, downloadResume } from '../api/userApi';
import LoadingSpinner from './LoadingSpinner';

/**
 * WHY THIS COMPONENT EXISTS:
 * Application Service only stores a raw applicantId - it deliberately does
 * NOT call User Service itself (no service-to-service calls, per
 * architecture rules). Instead, the FRONTEND fetches the candidate's
 * profile directly from User Service (through the Gateway) once a recruiter
 * asks to view it, using the applicantId already present on the
 * application record. This keeps the microservices decoupled while still
 * giving recruiters what they need to make a shortlist/reject decision.
 */
export default function ApplicantProfileModal({ applicantId, coverLetter, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleDownloadResume = async () => {
    try {
      setDownloading(true);
      const res = await downloadResume(profile.resumeFileUrl);
      const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
      window.open(blobUrl, '_blank');
      // Revoke after a delay so the new tab has time to load it.
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      setError('Failed to open resume. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    getCandidateProfile(applicantId)
      .then((res) => setProfile(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'This candidate has not set up a profile yet.'))
      .finally(() => setLoading(false));
  }, [applicantId]);

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: 'rgba(11,17,32,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ borderRadius: 16, border: 'none' }}>
          <div className="modal-header">
            <h5 className="modal-title">Candidate Profile</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <LoadingSpinner label="Loading candidate profile…" />
            ) : error ? (
              <div className="alert alert-warning py-2 mb-0">{error}</div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div>
                    <h5 className="mb-1">{profile.fullName || 'Unnamed candidate'}</h5>
                    <div className="text-muted-orbit small">{profile.headline}</div>
                    <div className="text-muted-orbit small">{profile.email} {profile.phone && `· ${profile.phone}`}</div>
                    {profile.location && <div className="text-muted-orbit small">{profile.location}</div>}
                  </div>
                  {profile.resumeFileUrl && (
                    <button
                      type="button"
                      onClick={handleDownloadResume}
                      disabled={downloading}
                      className="btn btn-orbit-outline btn-sm"
                    >
                      {downloading ? 'Opening…' : 'View resume'}
                    </button>
                  )}
                </div>

                {profile.summary && (
                  <div className="mb-3">
                    <h6 className="small text-uppercase text-muted-orbit">Summary</h6>
                    <p className="small mb-0">{profile.summary}</p>
                  </div>
                )}

                {coverLetter && (
                  <div className="mb-3">
                    <h6 className="small text-uppercase text-muted-orbit">Cover letter for this application</h6>
                    <p className="small mb-0" style={{ whiteSpace: 'pre-line' }}>{coverLetter}</p>
                  </div>
                )}

                {profile.skills?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="small text-uppercase text-muted-orbit">Skills</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {profile.skills.map((s) => (
                        <span key={s.id} className="job-type-chip">{s.name} ({s.proficiency})</span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.experience?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="small text-uppercase text-muted-orbit">Experience</h6>
                    {profile.experience.map((exp) => (
                      <div key={exp.id} className="mb-2">
                        <div className="fw-semibold small">{exp.jobTitle} · {exp.companyName}</div>
                        <div className="text-muted-orbit small">
                          {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {profile.education?.length > 0 && (
                  <div>
                    <h6 className="small text-uppercase text-muted-orbit">Education</h6>
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="mb-2">
                        <div className="fw-semibold small">{edu.degree} · {edu.institution}</div>
                        <div className="text-muted-orbit small">
                          {edu.fieldOfStudy} · {edu.startYear} - {edu.endYear || 'Present'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
