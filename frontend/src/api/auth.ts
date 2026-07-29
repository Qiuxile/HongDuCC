import api from './client'

export interface LoginParams {
  studentId: string
  password: string
}

export interface RegisterParams {
  studentId: string
  password: string
  nickname: string
}

export function login(params: LoginParams) {
  return api.post('/auth/login', params)
}

export function register(params: RegisterParams) {
  return api.post('/auth/register', params)
}

export function getMe() {
  return api.get('/auth/me')
}

export function changePassword(oldPassword: string, newPassword: string) {
  return api.put('/auth/change-password', { oldPassword, newPassword })
}
