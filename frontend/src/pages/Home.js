import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <section className="orbit-hero">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="section-eyebrow mb-3" style={{ color: '#8FB1FF' }}>Smart Recruitment Platform</div>
              <h1>Where careers find their orbit.</h1>
              <p className="lead mt-3 mb-4">
                JobOrbit connects job seekers, recruiters, and companies on one platform —
                search smarter, hire faster, and track every application in real time.
              </p>
              <div className="d-flex gap-3">
                {!user && (
                  <>
                    <Link to="/register" className="btn btn-orbit-gold">Create free account</Link>
                    <Link to="/jobs" className="btn btn-orbit-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                      Browse jobs
                    </Link>
                  </>
                )}
                {user && (
                  <Link to="/jobs" className="btn btn-orbit-gold">Browse jobs</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="orbit-card p-4 h-100">
              <div className="section-eyebrow mb-2">For Job Seekers</div>
              <h5>Search &amp; apply in seconds</h5>
              <p className="text-muted-orbit small mb-0">
                Filter jobs by keyword, location, and type. Build your profile once, apply everywhere.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="orbit-card p-4 h-100">
              <div className="section-eyebrow mb-2">For Recruiters</div>
              <h5>Post jobs, track applicants</h5>
              <p className="text-muted-orbit small mb-0">
                Manage postings and move candidates through Applied → Shortlisted → Hired.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="orbit-card p-4 h-100">
              <div className="section-eyebrow mb-2">For Admins</div>
              <h5>Oversee the whole platform</h5>
              <p className="text-muted-orbit small mb-0">
                Manage users, recruiters, and job postings from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
