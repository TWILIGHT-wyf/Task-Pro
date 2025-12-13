// Dashboard Mock 数据
export default [
  // 获取顶部统计卡片数据
  {
    url: '/api/dashboard/stats',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          sales: {
            title: '总销售额',
            value: '¥126,560',
            trend: '+12.5%',
            note: '较上月增长'
          },
          orders: {
            title: '订单总数',
            value: '2,458',
            trend: '+8.2%',
            note: '较上周增长'
          },
          users: {
            title: '新增用户',
            value: '1,234',
            trend: '+5.7%',
            note: '本月新增'
          },
          conversion: {
            title: '转化率',
            value: '68.5%',
            trend: '+3.1%',
            note: '环比上升'
          }
        }
      }
    }
  },

  // 获取图表数据
  {
    url: '/api/dashboard/chart',
    method: 'get',
    response: ({ query }) => {
      const { type = 'day' } = query

      let chartData = {}

      if (type === 'day') {
        chartData = {
          x: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          series: [10, 40, 120, 200, 150, 90, 30]
        }
      } else if (type === 'week') {
        chartData = {
          x: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          series: [120, 200, 150, 80, 70, 110, 130]
        }
      } else if (type === 'month') {
        chartData = {
          x: Array.from({ length: 30 }).map((_, i) => `${i + 1}日`),
          series: Array.from({ length: 30 }).map(() => Math.round(50 + Math.random() * 200))
        }
      }

      return {
        code: 0,
        data: chartData
      }
    }
  },

  // 获取排行榜数据
  {
    url: '/api/dashboard/rank',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          topProducts: [
            { id: 1, name: 'iPhone 15 Pro Max', sales: 856, percent: 100 },
            { id: 2, name: 'MacBook Pro M3', sales: 742, percent: 87 },
            { id: 3, name: 'AirPods Pro 2', sales: 623, percent: 73 },
            { id: 4, name: 'iPad Air 5', sales: 518, percent: 61 },
            { id: 5, name: 'Apple Watch Ultra 2', sales: 445, percent: 52 }
          ],
          recentOrders: [
            {
              id: 'ORD20251207001',
              customer: '张三',
              amount: 12999,
              status: '已完成',
              statusColor: 'success'
            },
            {
              id: 'ORD20251207002',
              customer: '李四',
              amount: 8999,
              status: '配送中',
              statusColor: 'primary'
            },
            {
              id: 'ORD20251207003',
              customer: '王五',
              amount: 3499,
              status: '待发货',
              statusColor: 'warning'
            },
            {
              id: 'ORD20251207004',
              customer: '赵六',
              amount: 15999,
              status: '已完成',
              statusColor: 'success'
            },
            {
              id: 'ORD20251207005',
              customer: '钱七',
              amount: 6999,
              status: '处理中',
              statusColor: 'info'
            }
          ]
        }
      }
    }
  },

  // 获取地图数据
  {
    url: '/api/dashboard/map',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: [
          { name: '北京', value: 1250 },
          { name: '天津', value: 580 },
          { name: '上海', value: 1450 },
          { name: '重庆', value: 620 },
          { name: '河北', value: 480 },
          { name: '河南', value: 520 },
          { name: '云南', value: 280 },
          { name: '辽宁', value: 390 },
          { name: '黑龙江', value: 310 },
          { name: '湖南', value: 440 },
          { name: '安徽', value: 350 },
          { name: '山东', value: 680 },
          { name: '新疆', value: 180 },
          { name: '江苏', value: 920 },
          { name: '浙江', value: 1080 },
          { name: '江西', value: 290 },
          { name: '湖北', value: 510 },
          { name: '广西', value: 320 },
          { name: '甘肃', value: 150 },
          { name: '山西', value: 260 },
          { name: '内蒙古', value: 190 },
          { name: '陕西', value: 380 },
          { name: '吉林', value: 220 },
          { name: '福建', value: 560 },
          { name: '贵州', value: 240 },
          { name: '广东', value: 1580 },
          { name: '青海', value: 80 },
          { name: '西藏', value: 50 },
          { name: '四川', value: 720 },
          { name: '宁夏', value: 90 },
          { name: '海南', value: 160 },
          { name: '台湾', value: 350 },
          { name: '香港', value: 420 },
          { name: '澳门', value: 110 }
        ]
      }
    }
  },

  // 获取报表统计数据
  {
    url: '/api/analytics',
    method: 'get',
    response: ({ query }) => {
      const { range = 'month' } = query

      const analyticsData = {
        today: {
          summary: { totalOrders: 156, totalSales: 125680, totalUsers: 89, avgOrderValue: 806 },
          trend: { rate: '+5.2%', direction: 'up' },
          categoryData: [
            { name: '电子产品', value: 45600 },
            { name: '服装鞋帽', value: 28900 },
            { name: '食品饮料', value: 18500 },
            { name: '家居用品', value: 21300 },
            { name: '其他', value: 11380 }
          ],
          salesTrend: {
            x: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            series: [120, 80, 60, 90, 180, 320, 450, 380, 420, 520, 480, 260]
          },
          visitTrend: {
            x: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            series: [850, 620, 480, 560, 1200, 2100, 2800, 2400, 2600, 3200, 2900, 1600]
          }
        },
        week: {
          summary: { totalOrders: 1089, totalSales: 879520, totalUsers: 623, avgOrderValue: 808 },
          trend: { rate: '+8.5%', direction: 'up' },
          categoryData: [
            { name: '电子产品', value: 319200 },
            { name: '服装鞋帽', value: 202300 },
            { name: '食品饮料', value: 129500 },
            { name: '家居用品', value: 149100 },
            { name: '其他', value: 79420 }
          ],
          salesTrend: {
            x: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            series: [98600, 112400, 108900, 125800, 142500, 168200, 123120]
          },
          visitTrend: {
            x: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            series: [12500, 14200, 13800, 15600, 18200, 21500, 16800]
          }
        },
        month: {
          summary: { totalOrders: 4356, totalSales: 3518080, totalUsers: 2492, avgOrderValue: 808 },
          trend: { rate: '+12.3%', direction: 'up' },
          categoryData: [
            { name: '电子产品', value: 1276800 },
            { name: '服装鞋帽', value: 809200 },
            { name: '食品饮料', value: 518000 },
            { name: '家居用品', value: 596400 },
            { name: '其他', value: 317680 }
          ],
          salesTrend: {
            x: Array.from({ length: 30 }).map((_, i) => `${i + 1}日`),
            series: Array.from({ length: 30 }).map(() => Math.round(80000 + Math.random() * 60000))
          },
          visitTrend: {
            x: Array.from({ length: 30 }).map((_, i) => `${i + 1}日`),
            series: Array.from({ length: 30 }).map(() => Math.round(12000 + Math.random() * 10000))
          }
        },
        year: {
          summary: { totalOrders: 52272, totalSales: 42216960, totalUsers: 29904, avgOrderValue: 808 },
          trend: { rate: '+18.6%', direction: 'up' },
          categoryData: [
            { name: '电子产品', value: 15321600 },
            { name: '服装鞋帽', value: 9710400 },
            { name: '食品饮料', value: 6216000 },
            { name: '家居用品', value: 7156800 },
            { name: '其他', value: 3812160 }
          ],
          salesTrend: {
            x: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            series: [2856000, 2680000, 3120000, 3280000, 3450000, 3680000, 3920000, 4100000, 3850000, 4250000, 4680000, 4350960]
          },
          visitTrend: {
            x: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            series: [156000, 148000, 172000, 185000, 198000, 215000, 228000, 242000, 225000, 248000, 268000, 252000]
          }
        }
      }

      return {
        code: 0,
        data: analyticsData[range] || analyticsData.month
      }
    }
  }
]
