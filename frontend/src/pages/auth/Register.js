import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrbitMark from '../../components/OrbitMark';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'JOB_SEEKER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'RECRUITER') navigate('/recruiter');
      else navigate('/jobseeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual col-lg-6 d-none d-lg-flex">
        <span className="ring-a" /><span className="ring-b" /><span className="ring-c" />
        <div style={{ zIndex: 1, maxWidth: 420 }}>
          <OrbitMark />
          <h2 className="text-white mt-3">Join the orbit.</h2>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Create your account as a job seeker or recruiter and start moving today.
          </p>
        </div>
      </div>

      <div className="auth-form-panel col-lg-6 col-12">
        <div className="container" style={{ maxWidth: 460 }}>
          <h3 className="mb-1">Create your account</h3>
          <p className="text-muted-orbit mb-4">It only takes a minute.</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input type="text" name="fullName" className="form-control" required minLength={3}
                     value={form.fullName} onChange={handleChange} placeholder="Jordan Patel" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" name="email" className="form-control" required
                     value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control" required minLength={6}
                     value={form.password} onChange={handleChange} placeholder="At least 6 characters, 1 number" />
            </div>
            <div className="mb-4">
              <label className="form-label">I am a…</label>
              <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>
            <button type="submit" className="btn btn-orbit-primary w-100" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 small">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
