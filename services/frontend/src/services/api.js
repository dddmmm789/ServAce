import axios from 'axios';

// Remove the base URL completely to use relative paths
const adminApi = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to handle auth
adminApi.interceptors.request.use(request => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// API Methods - use relative paths
export const adminMethods = {
  login: async (credentials) => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
    const data = response.status === 204 ? {} : await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  getLocksmiths: async () => {
    const response = await adminApi.get('/api/admin/locksmiths');
    return response.data;
  },

  getLocksmithsByStatus: async (status) => {
    const response = await adminApi.get(`/api/admin/locksmiths?status=${status}`);
    return response.data;
  },

  getLocksmithById: async (id) => {
    const response = await adminApi.get(`/api/admin/locksmiths/${id}`);
    return response.data;
  },

  updateLocksmithStatus: async (id, status) => {
    const response = await adminApi.put(`/api/admin/locksmiths/${id}/status`, { status });
    return response.data;
  }
};

export default adminMethods;
