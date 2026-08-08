import axios from 'axios';

/**
 * WHY THIS FILE EXISTS:
 * A single, pre-configured Axios instance is the ONLY way the React app
 * talks to the backend. Every request goes to the API Gateway (port 8080) -
 * never directly to a microservice - matching the "frontend communicates
 * only with the API Gateway" constraint.
 *
 * The request interceptor automatically attaches the JWT (if present) as
 * "Authorization: Bearer <token>" so individual pages/components never have
 * to remember to do this themselves.
 *
 * The response interceptor centrally handles 401s (expired/invalid token)
 * by logging the user out and redirecting to /login.
 */
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('joborbit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('joborbit_token');
      localStorage.removeItem('joborbit_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
