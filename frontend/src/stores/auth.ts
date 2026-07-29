import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as apiLogin, register as apiRegister, getMe, type LoginParams, type RegisterParams } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function init() {
    if (token.value) {
      try {
        user.value = await getMe()
      } catch {
        logout()
      }
    }
  }

  async function login(params: LoginParams) {
    const res: any = await apiLogin(params)
    token.value = res.access_token
    user.value = res.user
    localStorage.setItem('token', res.access_token)
    localStorage.setItem('user', JSON.stringify(res.user))
  }

  async function register(params: RegisterParams) {
    const res: any = await apiRegister(params)
    token.value = res.access_token
    user.value = res.user
    localStorage.setItem('token', res.access_token)
    localStorage.setItem('user', JSON.stringify(res.user))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, token, isAuthenticated, isAdmin, init, login, register, logout }
})
