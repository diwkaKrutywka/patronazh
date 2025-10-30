// utils/https.ts
import axios from 'axios'
import { useUserStore } from '../store/index'
import router from '../router'
import baseUrl from '../config'

const http = axios.create({
  baseURL: baseUrl.baseURL,
  timeout: 30000,
  headers: {
    'ngrok-skip-browser-warning': '69420',
    'Content-Type': 'application/json;charset=UTF-8',
  },
  // Ensure arrays are serialized as repeated keys: foo=a&foo=b
  paramsSerializer: {
    serialize: (params: Record<string, any>) => {
      const usp = new URLSearchParams()
      Object.entries(params || {}).forEach(([key, value]) => {
        if (value == null || value === '') return
        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v != null && v !== '') usp.append(key, String(v))
          })
        } else {
          usp.append(key, String(value))
        }
      })
      return usp.toString()
    },
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
        const refreshUrl = `${http.defaults.baseURL}auth/refresh/`
        const refreshResp = await axios.post(refreshUrl, { refresh_token: store.refreshToken })

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
