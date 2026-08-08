import api from './axiosInstance';

export const applyToJob = (payload) => api.post('/applications', payload);
export const withdrawApplication = (id) => api.delete(`/applications/${id}`);
export const getMyApplications = (params) => api.get('/applications/my-applications', { params });

export const getApplicantsForJob = (jobId, params) => api.get(`/applications/job/${jobId}`, { params });
export const getApplicationsForRecruiter = (params) => api.get('/applications/recruiter', { params });
export const updateApplicationStatus = (id, status) => api.patch(`/applications/${id}/status`, { status });
