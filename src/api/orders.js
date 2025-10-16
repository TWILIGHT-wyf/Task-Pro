import request from '../utils/request'

// 获取订单列表
export function getOrders(params) {
  return request({
    url: '/api/orders',
    method: 'get',
    params
  })
}

// 获取单个订单详情
export function getOrder(id) {
  return request({
    url: `/api/orders/${id}`,
    method: 'get'
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: '/api/orders',
    method: 'post',
    data
  })
}

// 更新订单
export function updateOrder(id, data) {
  return request({
    url: `/api/orders/${id}`,
    method: 'put',
    data
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `/api/orders/${id}`,
    method: 'delete'
  })
}

// 批量删除订单
export function batchDeleteOrders(ids) {
  return request({
    url: '/api/orders/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 获取订单统计
export function getOrderStats() {
  return request({
    url: '/api/orders/stats',
    method: 'get'
  })
}

// 更新订单状态
export function updateOrderStatus(id, status) {
  return request({
    url: `/api/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 批量更新订单状态
export function batchUpdateOrderStatus(ids, status) {
  return request({
    url: '/api/orders/batch-status',
    method: 'post',
    data: { ids, status }
  })
}

// 导出订单数据
export function exportOrders(params) {
  return request({
    url: '/api/orders/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
