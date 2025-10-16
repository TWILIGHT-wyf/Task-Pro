import request from '../utils/request.js'

// 获取分类列表
export function getCategories(params) {
  return request({
    url: '/api/categories',
    method: 'get',
    params
  })
}

// 获取单个分类详情
export function getCategory(id) {
  return request({
    url: `/api/categories/${id}`,
    method: 'get'
  })
}

// 创建分类
export function createCategory(data) {
  return request({
    url: '/api/categories',
    method: 'post',
    data
  })
}

// 更新分类
export function updateCategory(id, data) {
  return request({
    url: `/api/categories/${id}`,
    method: 'patch',
    data
  })
}

// 删除分类
export function deleteCategory(id) {
  return request({
    url: `/api/categories/${id}`,
    method: 'delete'
  })
}

// 批量删除分类
export function batchDeleteCategories(ids) {
  return request({
    url: '/api/categories/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 获取分类统计
export function getCategoryStats() {
  return request({
    url: '/api/categories/stats',
    method: 'get'
  })
}

// 切换分类状态
export function toggleCategoryStatus(id) {
  return request({
    url: `/api/categories/${id}/toggle-status`,
    method: 'put'
  })
}

// 批量启用分类
export function batchEnableCategories(ids) {
  return request({
    url: '/api/categories/batch-enable',
    method: 'post',
    data: { ids }
  })
}

// 批量禁用分类
export function batchDisableCategories(ids) {
  return request({
    url: '/api/categories/batch-disable',
    method: 'post',
    data: { ids }
  })
}

// 导出分类数据
export function exportCategories(params) {
  return request({
    url: '/api/categories/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
