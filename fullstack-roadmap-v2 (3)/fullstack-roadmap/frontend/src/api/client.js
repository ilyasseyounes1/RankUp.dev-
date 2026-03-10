import axios from 'axios';

// In production, set REACT_APP_API_URL to your backend URL
// e.g. https://your-backend.railway.app
// Locally, the CRA proxy handles /api -> localhost:8080
const BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({ baseURL: `${BASE_URL}/api` });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const login = (username, password) =>
  api.post('/auth/login', { username, password }).then(r => r.data);

export const register = (username, password, displayName) =>
  api.post('/auth/register', { username, password, displayName }).then(r => r.data);

export const getProgress = () =>
  api.get('/progress').then(r => r.data);

export const toggleTask = (taskKey) =>
  api.post('/progress/toggle', { taskKey }).then(r => r.data);

export const getActivity = () =>
  api.get('/progress/activity').then(r => r.data);
