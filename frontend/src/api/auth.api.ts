import api from './axios';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export const loginUser = async (data: LoginInput) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const registerUser = async (data: RegisterInput) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const logoutUser = async () => {
  await api.post('/auth/logout');
};

export const checkAuth = async () => {
  const res = await api.get('/user/me');
  return res.data;
};
