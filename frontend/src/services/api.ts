import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (name: string, email: string, password: string) =>
  api.post('/register', { name, email, password })

export const login = (email: string, password: string) =>
  api.post('/login', { email, password })

export const requestPasswordReset = (email: string) =>
  api.post('/request-reset', { email })

export const resetPassword = (email: string, otp: string, newPassword: string) =>
  api.post('/reset-password', { email, otp, newPassword })

export const getUsers = () => api.get('/users')

export default api