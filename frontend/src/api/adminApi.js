import api from './axiosInstance';

export const getAllUsers = () => api.get('/auth/admin/users');
export const updateUserStatus = (id, enabled) => api.patch(`/auth/admin/users/${id}/status`, { enabled });

export const getAllJobsAdmin = (params) => api.get('/jobs/admin/all', { params });
export const deleteJobAdmin = (id) => api.delete(`/jobs/${id}`);
