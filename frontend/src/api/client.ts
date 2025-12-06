import axios from 'axios'
import { useAuthStore } from '../store/auth.ts'

// En producción usa la URL de Render, en desarrollo usa el proxy local
const baseURL = import.meta.env.PROD
  ? 'https://inventario-84di.onrender.com/api'
  : '/api'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
