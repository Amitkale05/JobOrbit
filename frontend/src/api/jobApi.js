import api from './axiosInstance';

export const searchJobs = (params) => api.get('/jobs/search', { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (payload) => api.post('/jobs', payload);
export const updateJob = (id, payload) => api.put(`/jobs/${id}`, payload);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const getMyJobs = (params) => api.get('/jobs/my-jobs', { params });

export const getAllCompanies = () => api.get('/jobs/companies');
export const createCompany = (payload) => api.post('/jobs/companies', payload);
