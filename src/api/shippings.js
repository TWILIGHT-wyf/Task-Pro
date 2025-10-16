import request from '../utils/request'

// 获取配送列表
export function getShippings(params) {
  return request({
    url: '/api/shippings',
    method: 'get',
    params
  })
}

// 获取单个配送详情
export function getShipping(id) {
  return request({
    url: `/api/shippings/${id}`,
    method: 'get'
  })
}

// 创建配送
export function createShipping(data) {
  return request({
    url: '/api/shippings',
    method: 'post',
    data
  })
}

// 更新配送
export function updateShipping(id, data) {
  return request({
    url: `/api/shippings/${id}`,
    method: 'put',
    data
  })
}

// 删除配送
export function deleteShipping(id) {
  return request({
    url: `/api/shippings/${id}`,
    method: 'delete'
  })
}

// 批量删除配送
export function batchDeleteShippings(ids) {
  return request({
    url: '/api/shippings/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 批量更新状态
export function batchUpdateShippingStatus(ids, status) {
  return request({
    url: '/api/shippings/batch-status',
    method: 'post',
    data: { ids, status }
  })
}

// 更新配送状态
export function updateShippingStatus(id, status) {
  return request({
    url: `/api/shippings/${id}/status`,
    method: 'post',
    data: { status }
  })
}

// 导出配送
export function exportShippings(params) {
  return request({
    url: '/api/shippings/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 导入配送
export function importShippings(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/api/shippings/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
