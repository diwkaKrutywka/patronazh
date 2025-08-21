// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '' as string,
    refreshToken: (typeof localStorage !== 'undefined' ? localStorage.getItem('refresh_token') : '') || '' as string,
    user: (() => {
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    })() as any
  }),
  actions: {
    setTokens(access: string, refresh: string) {
      this.accessToken = access
      this.refreshToken = refresh
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('access_token', access)
          localStorage.setItem('refresh_token', refresh)
        }
      } catch {}
    },
    setUserData(userData: any) {
      this.user = userData
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData))
        }
      } catch {}
    },
    clear() {
      this.accessToken = ''
      this.refreshToken = ''
      this.user = null
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
        }
      } catch {}
    }
  }
})
