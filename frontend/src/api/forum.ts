import api from './client'

export function getPosts(params?: { page?: number; pageSize?: number; category?: string }) {
  return api.get('/forum', { params })
}
export function getPostDetail(id: number) {
  return api.get(`/forum/${id}`)
}
export function createPost(data: { title: string; content: string; category?: string; topicName?: string }) {
  return api.post('/forum', data)
}
export function likePost(id: number) {
  return api.post(`/forum/${id}/like`)
}
export function unlikePost(id: number) {
  return api.delete(`/forum/${id}/like`)
}
