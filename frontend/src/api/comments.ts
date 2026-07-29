import api from './client'

export function getComments(targetType: string, targetId: number) {
  return api.get('/comments', { params: { targetType, targetId } })
}
export function createComment(data: { targetType: string; targetId: number; parentId?: number; content: string }) {
  return api.post('/comments', data)
}
export function deleteComment(id: number) {
  return api.delete(`/comments/${id}`)
}
