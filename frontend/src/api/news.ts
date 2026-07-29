import api from './client'

export function getNewsList(params?: { page?: number; pageSize?: number; category?: string }) {
  return api.get('/news', { params })
}
export function getNewsDetail(id: number) {
  return api.get(`/news/${id}`)
}
