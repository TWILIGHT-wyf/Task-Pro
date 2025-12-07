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
  }
]
