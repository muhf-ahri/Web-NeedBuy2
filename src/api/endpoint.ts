import apiClient from './client';

export const register = (data: any) => apiClient.post('/auth/register', data);
export const login = (data: any) => apiClient.post('/auth/login', data);