import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import SearchJobs from './pages/SearchJobs';
import JobDetails from './pages/JobDetails';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import JobSeekerDashboard from './pages/jobseeker/JobSeekerDashboard';
import MyApplications from './pages/jobseeker/MyApplications';
import Profile from './pages/jobseeker/Profile';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import ManageJobs from './pages/recruiter/ManageJobs';
import JobForm from './pages/recruiter/JobForm';
import ViewApplicants from './pages/recruiter/ViewApplicants';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageJobsAdmin from './pages/admin/ManageJobsAdmin';

/**
 * WHY THIS FILE EXISTS:
 * Single source of truth for client-side routing. Public routes (home,
 * job search/details, login/register) are open to everyone; role-specific
 * dashboards are wrapped in <ProtectedRoute roles={[...]}> so an
 * unauthenticated user is redirected to /login and a wrongly-roled user is
 * redirected to their own dashboard (see ProtectedRoute.js).
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<SearchJobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Job Seeker */}
            <Route path="/jobseeker" element={<ProtectedRoute roles={['JOB_SEEKER']}><JobSeekerDashboard /></ProtectedRoute>} />
            <Route path="/jobseeker/search" element={<ProtectedRoute roles={['JOB_SEEKER']}><SearchJobs /></ProtectedRoute>} />
            <Route path="/jobseeker/applications" element={<ProtectedRoute roles={['JOB_SEEKER']}><MyApplications /></ProtectedRoute>} />
            <Route path="/jobseeker/profile" element={<ProtectedRoute roles={['JOB_SEEKER']}><Profile /></ProtectedRoute>} />

            {/* Recruiter */}
            <Route path="/recruiter" element={<ProtectedRoute roles={['RECRUITER']}><RecruiterDashboard /></ProtectedRoute>} />
            <Route path="/recruiter/jobs" element={<ProtectedRoute roles={['RECRUITER']}><ManageJobs /></ProtectedRoute>} />
            <Route path="/recruiter/jobs/new" element={<ProtectedRoute roles={['RECRUITER']}><JobForm /></ProtectedRoute>} />
            <Route path="/recruiter/jobs/:id/edit" element={<ProtectedRoute roles={['RECRUITER']}><JobForm /></ProtectedRoute>} />
            <Route path="/recruiter/applicants" element={<ProtectedRoute roles={['RECRUITER']}><ViewApplicants /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><ManageUsers /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute roles={['ADMIN']}><ManageJobsAdmin /></ProtectedRoute>} />

            <Route path="*" element={<div className="container py-5 text-center">Page not found.</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
