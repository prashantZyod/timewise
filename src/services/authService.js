import api from './api';

const authService = {
  login: async (email, password, rememberMe = false) => {
    const response = await api.post('/users/login', { email, password, rememberMe });
    return response.data;
  },
  
  logout: async () => {
    return api.post('/users/logout');
  },
  
  refreshToken: async (refreshToken) => {
    const response = await api.post('/users/refresh-token', { refreshToken });
    return response.data;
  },
  
  requestPasswordReset: async (email) => {
    return api.post('/users/forgot-password', { email });
  },
  
  resetPassword: async (token, newPassword) => {
    return api.post('/users/reset-password', { token, newPassword });
  },
  
  verifyEmail: async (token) => {
    const response = await api.post('/users/verify-email', { token });
    return response.data;
  },
  
  resendVerificationEmail: async (email) => {
    return api.post('/users/resend-verification', { email });
  },
  
  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  
  changePassword: async (currentPassword, newPassword) => {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  }
};

export default authService;