import request from '../utils/request'

// 获取促销列表
export function getPromotions(params) {
  return request({
    url: '/api/promotions',
    method: 'get',
    params
  })
}

// 获取单个促销详情
export function getPromotion(id) {
  return request({
    url: `/api/promotions/${id}`,
    method: 'get'
  })
}

// 创建促销
export function createPromotion(data) {
  return request({
    url: '/api/promotions',
    method: 'post',
    data
  })
}

// 更新促销
export function updatePromotion(id, data) {
  return request({
    url: `/api/promotions/${id}`,
    method: 'put',
    data
  })
}

// 删除促销
export function deletePromotion(id) {
  return request({
    url: `/api/promotions/${id}`,
    method: 'delete'
  })
}

// 批量删除促销
export function batchDeletePromotions(ids) {
  return request({
    url: '/api/promotions/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 获取促销统计
export function getPromotionStats() {
  return request({
    url: '/api/promotions/stats',
    method: 'get'
  })
}

// 切换促销状态
export function togglePromotionStatus(id) {
  return request({
    url: `/api/promotions/${id}/toggle-status`,
    method: 'put'
  })
}

// 批量启用促销
export function batchEnablePromotions(ids) {
  return request({
    url: '/api/promotions/batch-enable',
    method: 'post',
    data: { ids }
  })
}

// 批量禁用促销
export function batchDisablePromotions(ids) {
  return request({
    url: '/api/promotions/batch-disable',
    method: 'post',
    data: { ids }
  })
}

// 导出促销数据
export function exportPromotions(params) {
  return request({
    url: '/api/promotions/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
