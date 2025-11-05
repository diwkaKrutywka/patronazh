import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import http from '../utils/https'
import { useUserStore } from '../store/index'
import { isSupervisor, isNurse } from '../types/roles'

export function ReportsApi<T = any>(
  url: string,
  data?: Record<string, any> | FormData,
  method: Method = 'POST',
  options?: { fileDownload?: boolean; fileUpload?: boolean }
): Promise<AxiosResponse<T>> {
  const userStore = useUserStore()
  const userRole = userStore.user?.user_role || ''

  // Determine the correct API endpoint based on user role and report type
  let apiUrl = `reports/${url}`
  
  // Map report types to role-based endpoints
  if (url.includes('progressive-package')) {
    if (isSupervisor(userRole)) {
      apiUrl = `reports/progressive-package/`
    } else if (isNurse(userRole)) {
      apiUrl = `reports/nurses/progressive-package/`
    }
  } else if (url.includes('universal-package')) {
    if (isSupervisor(userRole)) {
      apiUrl = `reports/universal-package/`
    } else if (isNurse(userRole)) {
      apiUrl = `reports/nurses/universal-package/`
    }
  } else if (url.includes('nurse-diary-universal')) {
    if (isSupervisor(userRole)) {
      apiUrl = `reports/nurse-diary-universal/`
    } else if (isNurse(userRole)) {
      apiUrl = `reports/nurses/nurse-diary/`
    }
  }

  const config: AxiosRequestConfig = {
    url: apiUrl,
    method,
  }

  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    config.data = data
  } else if (method.toUpperCase() === 'GET') {
    config.params = data
  }

  // Если скачиваем файл
  if (options?.fileDownload) {
    config.responseType = 'blob'
  }

  // Если загружаем файл
  if (options?.fileUpload) {
    config.headers = {
      ...(config.headers || {}),
      'Content-Type': 'multipart/form-data',
    }
  }

  return http(config)
}
