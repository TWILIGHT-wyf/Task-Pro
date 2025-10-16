import request from '../utils/request'

// 获取商品列表
export function getProducts(params) {
  return request({
    url: '/api/products',
    method: 'get',
    params
  })
}

// 获取单个商品详情
export function getProduct(id) {
  return request({
    url: `/api/products/${id}`,
    method: 'get'
  })
}

// 创建商品
export function createProduct(data) {
  return request({
    url: '/api/products',
    method: 'post',
    data
  })
}

// 更新商品
export function updateProduct(id, data) {
  return request({
    url: `/api/products/${id}`,
    method: 'put',
    data
  })
}

// 删除商品
export function deleteProduct(id) {
  return request({
    url: `/api/products/${id}`,
    method: 'delete'
  })
}

// 批量删除商品
export function batchDeleteProducts(ids) {
  return request({
    url: '/api/products/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 获取商品统计
export function getProductStats() {
  return request({
    url: '/api/products/stats',
    method: 'get'
  })
}

// 切换商品状态
export function toggleProductStatus(id) {
  return request({
    url: `/api/products/${id}/toggle-status`,
    method: 'put'
  })
}

// 批量启用商品
export function batchEnableProducts(ids) {
  return request({
    url: '/api/products/batch-enable',
    method: 'post',
    data: { ids }
  })
}

// 批量禁用商品
export function batchDisableProducts(ids) {
  return request({
    url: '/api/products/batch-disable',
    method: 'post',
    data: { ids }
  })
}

// 更新商品库存
export function updateProductStock(id, stock) {
  return request({
    url: `/api/products/${id}/stock`,
    method: 'put',
    data: { stock }
  })
}

// 批量更新商品库存
export function batchUpdateProductStock(updates) {
  return request({
    url: '/api/products/batch-stock',
    method: 'post',
    data: { updates }
  })
}

// 导出商品数据
export function exportProducts(params) {
  return request({
    url: '/api/products/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
