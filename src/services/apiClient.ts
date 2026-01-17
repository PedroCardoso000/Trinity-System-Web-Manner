import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('trinity_token')
  if (token) {
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders()
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient

