import axios from 'axios';

const token = localStorage.getItem("token");
const api = axios.create({ baseURL: '/api', withCredentials: true });

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const res = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      originalRequest.headers['Authorization'] = `Bearer ${token}`;

      return api(originalRequest);
    }

    return Promise.reject(err);
  }
);

export default api;
