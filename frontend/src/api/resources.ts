import api from './client'

export function getResources(params?: { page?: number; pageSize?: number; category?: string; subject?: string; grade?: string; search?: string }) {
  return api.get('/resources', { params })
}
export function getResourceDetail(id: number) {
  return api.get(`/resources/${id}`)
}
export function likeResource(id: number) {
  return api.post(`/resources/${id}/like`)
}
export function unlikeResource(id: number) {
  return api.delete(`/resources/${id}/like`)
}
