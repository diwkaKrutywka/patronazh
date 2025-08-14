import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import http from '../utils/https'

export function KidsApi<T = any>(
  url: string,
  data?: Record<string, any> | FormData,
  method: Method = 'POST',
  options?: { fileDownload?: boolean; fileUpload?: boolean }
): Promise<AxiosResponse<T>> {
  const config: AxiosRequestConfig = {
    url: `children/${url}`,
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
