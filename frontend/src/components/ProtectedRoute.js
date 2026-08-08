import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * WHY THIS COMPONENT EXISTS:
 * Guards role-restricted routes. If nobody is logged in, redirect to
 * /login. If someone IS logged in but their role isn't in `roles`,
 * redirect them to their own dashboard instead of showing a blank/broken
 * page - this is client-side UX only; the real authorization boundary is
 * enforced server-side by the Gateway + each microservice.
 */
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    const fallback = user.role === 'ADMIN' ? '/admin' : user.role === 'RECRUITER' ? '/recruiter' : '/jobseeker';
    return <Navigate to={fallback} replace />;
  }
  return children;
}
