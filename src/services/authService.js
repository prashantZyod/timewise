import api from './api';

const authService = {
  login: async (email, password, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    return response.data;
  },
  
  logout: async () => {
    return api.post('/auth/logout');
  },
  
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
  
  requestPasswordReset: async (email) => {
    return api.post('/auth/request-reset', { email });
  },
  
  resetPassword: async (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },
  
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },
  
  resendVerificationEmail: async (email) => {
    return api.post('/auth/resend-verification', { email });
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
  
  changePassword: async (currentPassword, newPassword) => {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  }
};

export default authService;