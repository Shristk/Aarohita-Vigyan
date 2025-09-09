import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    
    // Extract validation errors for better error handling
    if (error.response?.status === 400 && error.response?.data) {
      const validationErrors = error.response.data;
      
      // Create user-friendly error message
      let errorMessage = 'Validation failed ';
      const errorMessages = [];
      
      Object.entries(validationErrors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          errorMessages.push(...messages);
        } else if (typeof messages === 'string') {
          errorMessages.push(messages);
        }
      });
      
      error.userFriendlyMessage = errorMessages.join(' ');
    }
    
    return Promise.reject(error);
  }
);

export const taskAPI = {
  getTasks: (filter = null) => {
    const params = {};
    if (filter && filter !== 'all') {
      if (filter === 'pending') {
        params.status = 'pending';
      } else if (filter === 'completed') {
        params.status = 'completed';
      } else if (['today', 'overdue', 'scheduled'].includes(filter)) {
        params.schedule = filter;
      } else if (['low', 'medium', 'high', 'urgent'].includes(filter)) {
        params.priority = filter;
      }
    }
    return api.get('/tasks/', { params });
  },

  createTask: (taskData) => {
    return api.post('/tasks/', taskData);
  },

  updateTask: (id, taskData) => {
    return api.patch(`/tasks/${id}/`, taskData);
  },

  toggleTask: (id) => {
    return api.patch(`/tasks/${id}/`);
  },

  deleteTask: (id) => {
    return api.delete(`/tasks/${id}/`);
  },
};

export default api;
