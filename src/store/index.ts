// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: '' as string,
    refreshToken: '' as string,
    user: null as any
  }),
  actions: {
    setTokens(access: string, refresh: string) {
      this.accessToken = access
      this.refreshToken = refresh
    },
    setUserData(userData: any) {
      this.user = userData
    },
    clear() {
      this.accessToken = ''
      this.refreshToken = ''
      this.user = null
    }
  }
})
