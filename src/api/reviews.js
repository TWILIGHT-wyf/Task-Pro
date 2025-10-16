import request from '../utils/request'

// 获取评论列表
export function getReviews(params) {
  return request({
    url: '/api/reviews',
    method: 'get',
    params
  })
}

// 获取单个评论详情
export function getReview(id) {
  return request({
    url: `/api/reviews/${id}`,
    method: 'get'
  })
}

// 创建评论
export function createReview(data) {
  return request({
    url: '/api/reviews',
    method: 'post',
    data
  })
}

// 更新评论
export function updateReview(id, data) {
  return request({
    url: `/api/reviews/${id}`,
    method: 'put',
    data
  })
}

// 删除评论
export function deleteReview(id) {
  return request({
    url: `/api/reviews/${id}`,
    method: 'delete'
  })
}

// 批量删除评论
export function batchDeleteReviews(ids) {
  return request({
    url: '/api/reviews/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 批量更新状态
export function batchUpdateStatus(ids, status) {
  return request({
    url: '/api/reviews/batch-status',
    method: 'post',
    data: { ids, status }
  })
}

// 审核评论
export function auditReview(id, status) {
  return request({
    url: `/api/reviews/${id}/audit`,
    method: 'post',
    data: { status }
  })
}

// 批量审核
export function batchAuditReviews(ids, status) {
  return request({
    url: '/api/reviews/batch-audit',
    method: 'post',
    data: { ids, status }
  })
}

// 导出评论
export function exportReviews(params) {
  return request({
    url: '/api/reviews/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 导入评论
export function importReviews(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/api/reviews/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
