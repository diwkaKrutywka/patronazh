import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import tailwindcss from 'tailwindcss'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Функция для загрузки переменных из stack.env
function loadStackEnv() {
  try {
    const envPath = resolve(process.cwd(), 'stack.env')
    const envContent = readFileSync(envPath, 'utf-8')
    const env: Record<string, string> = {}
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim()
      }
    })
    
    return env
  } catch (error) {
    console.warn('stack.env not found, using default values')
    return {}
  }
}

// https://vite.dev/config/
export default defineConfig(() => {
  const stackEnv = loadStackEnv()
  
  return {
    plugins: [vue()],
    server: {
      host: true,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '.ngrok.io',
        '.ngrok-free.app'
      ]
    },
    // Передаем переменные окружения в приложение
    define: {
      __VITE_BASE_API_URL__: JSON.stringify(stackEnv.VITE_BASE_API_URL || ''),
      __IMAGE_REGISTRY_URL__: JSON.stringify(stackEnv.IMAGE_REGISTRY_URL || '')
    }
  }
})
