import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const portfolioService = {
  getPublicPortfolio: (userId) => api.get(`/portfolio/${userId}`),
  addProject: (formData) => api.post('/portfolio/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  editProject: (id, formData) => api.put(`/portfolio/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  removeProject: (id) => api.delete(`/portfolio/projects/${id}`)
};

export const feedbackService = {
  getFeedback: (projectId) => api.get(`/feedback/projects/${projectId}`),
  addFeedback: (projectId, data) => api.post(`/feedback/projects/${projectId}`, data),
  removeComment: (commentId) => api.delete(`/feedback/comments/${commentId}`)
};

export default api;