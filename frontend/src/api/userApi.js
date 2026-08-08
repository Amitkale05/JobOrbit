import api from './axiosInstance';

export const getMyProfile = () => api.get('/users/profile');
export const getCandidateProfile = (userId) => api.get(`/users/${userId}/profile`);
export const updateProfile = (payload) => api.put('/users/profile', payload);
export const uploadResume = (formData) =>
  api.post('/users/profile/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

/**
 * Resume download must go through the authenticated Axios instance (blob
 * response), NOT a plain <a href> - a raw browser navigation carries no
 * Authorization header, which is why direct links 401 against the gateway.
 * resumeFileUrl already comes back as "/api/users/profile/resume/<file>"
 * from the backend, but our axios baseURL already includes "/api", so we
 * strip that leading segment before requesting.
 */
export const downloadResume = (resumeFileUrl) => {
  const path = resumeFileUrl.replace(/^\/api/, '');
  return api.get(path, { responseType: 'blob' });
};

export const addEducation = (payload) => api.post('/users/profile/education', payload);
export const updateEducation = (id, payload) => api.put(`/users/profile/education/${id}`, payload);
export const deleteEducation = (id) => api.delete(`/users/profile/education/${id}`);

export const addExperience = (payload) => api.post('/users/profile/experience', payload);
export const updateExperience = (id, payload) => api.put(`/users/profile/experience/${id}`, payload);
export const deleteExperience = (id) => api.delete(`/users/profile/experience/${id}`);

export const addSkill = (payload) => api.post('/users/profile/skills', payload);
export const deleteSkill = (id) => api.delete(`/users/profile/skills/${id}`);
