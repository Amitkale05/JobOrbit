import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrbitMark from '../../components/OrbitMark';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'RECRUITER') navigate('/recruiter');
      else navigate('/jobseeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
          <h2 className="text-white mt-3">Welcome back.</h2>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Log in to continue tracking applications, managing postings, or discovering your next role.
          </p>
        </div>
      </div>

      <div className="auth-form-panel col-lg-6 col-12">
        <div className="container" style={{ maxWidth: 420 }}>
          <h3 className="mb-1">Log in to JobOrbit</h3>
          <p className="text-muted-orbit mb-4">Enter your credentials to access your dashboard.</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" name="email" className="form-control" required
                     value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control" required
                     value={form.password} onChange={handleChange} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-orbit-primary w-100" disabled={loading}>
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 small">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
