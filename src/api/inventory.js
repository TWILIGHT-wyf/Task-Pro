import request from '../utils/request'

// 获取库存列表
export function getInventory(params) {
  return request({
    url: '/api/inventory',
    method: 'get',
    params
  })
}

// 获取单个库存记录
export function getInventoryItem(id) {
  return request({
    url: `/api/inventory/${id}`,
    method: 'get'
  })
}

// 创建库存记录
export function createInventoryItem(data) {
  return request({
    url: '/api/inventory',
    method: 'post',
    data
  })
}

// 更新库存记录
export function updateInventoryItem(id, data) {
  return request({
    url: `/api/inventory/${id}`,
    method: 'put',
    data
  })
}

// 删除库存记录
export function deleteInventoryItem(id) {
  return request({
    url: `/api/inventory/${id}`,
    method: 'delete'
  })
}

// 批量删除库存记录
export function batchDeleteInventory(ids) {
  return request({
    url: '/api/inventory/batch',
    method: 'delete',
    data: { ids }
  })
}

// 商品入库
export function stockIn(data) {
  return request({
    url: '/api/inventory/stock-in',
    method: 'post',
    data
  })
}

// 商品出库
export function stockOut(data) {
  return request({
    url: '/api/inventory/stock-out',
    method: 'post',
    data
  })
}

// 库存调整
export function adjustStock(data) {
  return request({
    url: '/api/inventory/adjust',
    method: 'post',
    data
  })
}

// 批量调整库存
export function batchAdjustStock(adjustments) {
  return request({
    url: '/api/inventory/batch-adjust',
    method: 'post',
    data: { adjustments }
  })
}

// 获取库存统计
export function getInventoryStats() {
  return request({
    url: '/api/inventory/stats',
    method: 'get'
  })
}

// 导出库存数据
export function exportInventory(params) {
  return request({
    url: '/api/inventory/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}