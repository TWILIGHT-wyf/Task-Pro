import request from '../utils/request'

// 获取仪表盘统计数据
export function getDashboardStats() {
  return request({
    url: '/api/dashboard/stats',
    method: 'get'
  })
}

// 获取图表数据
export function getDashboardChart(type = 'day') {
  return request({
    url: '/api/dashboard/chart',
    method: 'get',
    params: { type }
  })
}

// 获取排行榜数据
export function getDashboardRank() {
  return request({
    url: '/api/dashboard/rank',
    method: 'get'
  })
}

// 获取地图数据
export function getDashboardMapData() {
  return request({
    url: '/api/dashboard/map',
    method: 'get'
  })
}

// 获取报表统计数据
export function getAnalyticsData(range = 'month') {
  return request({
    url: '/api/analytics',
    method: 'get',
    params: { range }
  })
}
