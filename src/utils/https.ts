// utils/https.ts
import axios from 'axios'
import { useUserStore } from '../store/index'
import router from '../router'

const http = axios.create({
  baseURL: 'https://rapidly-magnetic-seahorse.ngrok-free.app/api/v1/',
  timeout: 30000,
  headers: {
    'ngrok-skip-browser-warning': '69420',
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// Request interceptor — добавляем токен
http.interceptors.request.use((config) => {
  const store = useUserStore()
  if (store.accessToken) {
    config.headers.Authorization = `Bearer ${store.accessToken}`
  }
  return config
})

// Response interceptor — обновляем токен при 401
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const store = useUserStore()

    if (error.response?.status === 401) {
      try {
        // Пытаемся обновить токен
        const refreshResp = await axios.post(
          'https://rapidly-magnetic-seahorse.ngrok-free.app/auth/api/v1/auth/refresh',
          { refresh_token: store.refreshToken }
        )

        const { access_token, refresh_token } = refreshResp.data
        store.setTokens(access_token, refresh_token)

        // Повторяем оригинальный запрос
        error.config.headers.Authorization = `Bearer ${access_token}`
        return http(error.config)

      } catch (refreshErr) {
        // Если refresh не сработал — на логин
        store.clear()
        router.push('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default http
