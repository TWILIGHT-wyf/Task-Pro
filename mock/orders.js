// 订单数据
const orders = [
  {
    id: 1,
    orderNumber: 'ORD20241014001',
    customerName: '张三',
    customerEmail: 'zhangsan@example.com',
    customerPhone: '13800138001',
    productName: 'iPhone 15 Pro',
    quantity: 1,
    unitPrice: 8999.00,
    totalAmount: 8999.00,
    status: 'paid',
    shippingAddress: '北京市朝阳区建国门外大街1号',
    notes: '请尽快发货',
    createdAt: '2024-10-14T10:00:00Z',
    updatedAt: '2024-10-14T10:00:00Z'
  },
  {
    id: 2,
    orderNumber: 'ORD20241014002',
    customerName: '李四',
    customerEmail: 'lisi@example.com',
    customerPhone: '13800138002',
    productName: 'MacBook Pro 16寸',
    quantity: 1,
    unitPrice: 19999.00,
    totalAmount: 19999.00,
    status: 'shipped',
    shippingAddress: '上海市浦东新区陆家嘴金融贸易区',
    notes: '公司采购',
    createdAt: '2024-10-13T15:30:00Z',
    updatedAt: '2024-10-14T09:00:00Z'
  },
  {
    id: 3,
    orderNumber: 'ORD20241014003',
    customerName: '王五',
    customerEmail: 'wangwu@example.com',
    customerPhone: '13800138003',
    productName: 'AirPods Pro',
    quantity: 2,
    unitPrice: 1999.00,
    totalAmount: 3998.00,
    status: 'completed',
    shippingAddress: '广州市天河区珠江新城',
    notes: '',
    createdAt: '2024-10-12T14:20:00Z',
    updatedAt: '2024-10-13T16:00:00Z'
  },
  {
    id: 4,
    orderNumber: 'ORD20241014004',
    customerName: '赵六',
    customerEmail: 'zhaoliu@example.com',
    customerPhone: '13800138004',
    productName: 'iPad Air',
    quantity: 1,
    unitPrice: 4799.00,
    totalAmount: 4799.00,
    status: 'pending',
    shippingAddress: '深圳市南山区科技园',
    notes: '周末前送到',
    createdAt: '2024-10-14T08:45:00Z',
    updatedAt: '2024-10-14T08:45:00Z'
  },
  {
    id: 5,
    orderNumber: 'ORD20241014005',
    customerName: '孙七',
    customerEmail: 'sunqi@example.com',
    customerPhone: '13800138005',
    productName: 'Apple Watch Series 9',
    quantity: 1,
    unitPrice: 3199.00,
    totalAmount: 3199.00,
    status: 'cancelled',
    shippingAddress: '成都市锦江区春熙路',
    notes: '客户取消订单',
    createdAt: '2024-10-11T11:15:00Z',
    updatedAt: '2024-10-12T10:30:00Z'
  }
]

// API 路由配置
export default [
  // 获取订单列表
  {
    url: '/api/orders',
    method: 'get',
    response: ({ query }) => {
      let filteredList = [...orders]

      // 搜索
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        filteredList = filteredList.filter(order =>
          order.orderNumber.toLowerCase().includes(keyword) ||
          order.customerName.toLowerCase().includes(keyword) ||
          order.productName.toLowerCase().includes(keyword)
        )
      }

      // 筛选
      if (query.status) {
        filteredList = filteredList.filter(order => order.status === query.status)
      }

      if (query.minPrice) {
        filteredList = filteredList.filter(order => order.totalAmount >= parseFloat(query.minPrice))
      }

      if (query.maxPrice) {
        filteredList = filteredList.filter(order => order.totalAmount <= parseFloat(query.maxPrice))
      }

      // 排序
      if (query.sortBy) {
        filteredList.sort((a, b) => {
          let aValue = a[query.sortBy]
          let bValue = b[query.sortBy]

          if (query.sortBy === 'createdAt') {
            aValue = new Date(aValue).getTime()
            bValue = new Date(bValue).getTime()
          }

          if (query.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })
      }

      // 分页
      const page = parseInt(query.page) || 1
      const size = parseInt(query.size) || 10
      const start = (page - 1) * size
      const end = start + size
      const totalRecords = filteredList.length
      const paginatedList = filteredList.slice(start, end)

      return {
        code: 0,
        data: {
          list: paginatedList,
          totalRecords: totalRecords
        }
      }
    }
  },

  // 添加订单
  {
    url: '/api/orders',
    method: 'post',
    response: ({ body }) => {
      const newOrder = {
        id: orders.length + 1,
        ...body,
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      orders.push(newOrder)
      return {
        code: 0,
        message: '添加成功',
        data: newOrder
      }
    }
  },

  // 删除订单
  {
    url: '/api/orders/:id',
    method: 'delete',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop())
      const index = orders.findIndex(order => order.id === id)
      if (index > -1) {
        orders.splice(index, 1)
        return {
          code: 0,
          message: '删除成功'
        }
      } else {
        return {
          code: 1,
          message: '订单不存在'
        }
      }
    }
  },

  // 更新订单
  {
    url: '/api/orders/:id',
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.split('/').pop())
      const order = orders.find(order => order.id === id)
      if (order) {
        Object.assign(order, body, { updatedAt: new Date().toISOString() })
        return {
          code: 0,
          message: '更新成功',
          data: order
        }
      } else {
        return {
          code: 1,
          message: '订单不存在'
        }
      }
    }
  },

  // 批量删除订单
  {
    url: '/api/orders/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let deletedCount = 0
      ids.forEach(id => {
        const index = orders.findIndex(order => order.id === id)
        if (index > -1) {
          orders.splice(index, 1)
          deletedCount++
        }
      })
      return {
        code: 0,
        message: `成功删除 ${deletedCount} 个订单`,
        data: { deletedCount }
      }
    }
  },

  // 获取订单统计
  {
    url: '/api/orders/stats',
    method: 'get',
    response: () => {
      const total = orders.length
      const paid = orders.filter(o => o.status === 'paid').length
      const shipped = orders.filter(o => o.status === 'shipped').length
      const completed = orders.filter(o => o.status === 'completed').length
      const cancelled = orders.filter(o => o.status === 'cancelled').length
      const pending = orders.filter(o => o.status === 'pending').length
      const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0)

      return {
        code: 0,
        data: {
          total,
          paid,
          shipped,
          completed,
          cancelled,
          pending,
          totalAmount
        }
      }
    }
  },

  // 更新订单状态
  {
    url: '/api/orders/:id/status',
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.split('/').pop())
      const order = orders.find(order => order.id === id)
      if (order) {
        order.status = body.status
        order.updatedAt = new Date().toISOString()
        return {
          code: 0,
          message: '状态更新成功',
          data: order
        }
      } else {
        return {
          code: 1,
          message: '订单不存在'
        }
      }
    }
  },

  // 批量更新订单状态
  {
    url: '/api/orders/batch-status',
    method: 'post',
    response: ({ body }) => {
      const { ids, status } = body
      let updatedCount = 0
      ids.forEach(id => {
        const order = orders.find(o => o.id === id)
        if (order) {
          order.status = status
          order.updatedAt = new Date().toISOString()
          updatedCount++
        }
      })
      return {
        code: 0,
        message: `成功更新 ${updatedCount} 个订单状态`,
        data: { updatedCount }
      }
    }
  },

  // 导出订单数据
  {
    url: '/api/orders/export',
    method: 'get',
    response: ({ query }) => {
      let exportData = [...orders]

      // 应用过滤条件
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        exportData = exportData.filter(order =>
          order.orderNumber.toLowerCase().includes(keyword) ||
          order.customerName.toLowerCase().includes(keyword) ||
          order.productName.toLowerCase().includes(keyword)
        )
      }

      if (query.status) {
        exportData = exportData.filter(order => order.status === query.status)
      }

      if (query.minPrice) {
        exportData = exportData.filter(order => order.totalAmount >= parseFloat(query.minPrice))
      }

      if (query.maxPrice) {
        exportData = exportData.filter(order => order.totalAmount <= parseFloat(query.maxPrice))
      }

      return {
        code: 0,
        data: exportData,
        message: `导出 ${exportData.length} 条订单数据`
      }
    }
  }
]
