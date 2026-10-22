import axios from 'axios'

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  'https://brielle-preadvisory-lorriane.ngrok-free.dev'

export const httpClient = axios.create({
  baseURL: API_ORIGIN,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cureconnect_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { API_ORIGIN }
