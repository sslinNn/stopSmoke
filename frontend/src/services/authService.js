import api from './api';
import { AUTH_ENDPOINTS } from '../constants/auth';

// Функция для регистрации пользователя
export async function register(userData) {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
  return response.data;
}

// Функция для входа пользователя
export async function login(credentials) {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
  return response.data;
}

// Функция для выхода пользователя
export async function logout() {
  const response = await api.post(AUTH_ENDPOINTS.LOGOUT);
  return response.data;
}

// Функция для получения текущего пользователя
export async function getCurrentUser() {
  const response = await api.get(AUTH_ENDPOINTS.ME);
  return response.data;
}