import request from '../utils/request'

// 获取会员列表
export function getCustomers(params) {
  return request({
    url: '/api/customers',
    method: 'get',
    params
  })
}

// 获取单个会员详情
export function getCustomer(id) {
  return request({
    url: `/api/customers/${id}`,
    method: 'get'
  })
}

// 创建会员
export function createCustomer(data) {
  return request({
    url: '/api/customers',
    method: 'post',
    data
  })
}

// 更新会员
export function updateCustomer(id, data) {
  return request({
    url: `/api/customers/${id}`,
    method: 'put',
    data
  })
}

// 删除会员
export function deleteCustomer(id) {
  return request({
    url: `/api/customers/${id}`,
    method: 'delete'
  })
}

// 批量删除会员
export function batchDeleteCustomers(ids) {
  return request({
    url: '/api/customers/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 获取会员统计
export function getCustomerStats() {
  return request({
    url: '/api/customers/stats',
    method: 'get'
  })
}

// 切换会员状态
export function toggleCustomerStatus(id) {
  return request({
    url: `/api/customers/${id}/toggle-status`,
    method: 'put'
  })
}

// 批量启用会员
export function batchEnableCustomers(ids) {
  return request({
    url: '/api/customers/batch-enable',
    method: 'post',
    data: { ids }
  })
}

// 批量禁用会员
export function batchDisableCustomers(ids) {
  return request({
    url: '/api/customers/batch-disable',
    method: 'post',
    data: { ids }
  })
}

// 导出会员数据
export function exportCustomers(params) {
  return request({
    url: '/api/customers/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
