import Mock from 'mockjs'

const Random = Mock.Random

// 生成配送数据
const generateShippings = (count = 50) => {
  const shippings = []
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const methods = ['顺丰快递', '圆通快递', '中通快递', '申通快递', '韵达快递', 'EMS', '京东物流']
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆']

  for (let i = 1; i <= count; i++) {
    const createTime = Random.datetime('yyyy-MM-dd HH:mm:ss')
    const estimatedDelivery = new Date(new Date(createTime).getTime() + Random.integer(2, 7) * 24 * 60 * 60 * 1000)

    shippings.push({
      id: i,
      orderId: Random.integer(1, 100),
      orderNumber: `ORD${Random.string('number', 10)}`,
      trackingNumber: Random.string('upper', 2) + Random.string('number', 12),
      shippingMethod: Random.pick(methods),
      status: Random.pick(statuses),
      sender: {
        name: '商家仓库',
        phone: '400-888-8888',
        address: Random.city() + Random.county() + Random.csentence(5, 10)
      },
      recipient: {
        name: Random.cname(),
        phone: /^1[3-9]\d{9}$/,
        address: Random.pick(cities) + Random.county() + Random.csentence(5, 10)
      },
      weight: Random.float(0.1, 5, 1, 2),
      shippingFee: Random.float(0, 20, 2, 2),
      estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
      actualDelivery: Random.boolean() ? Random.datetime('yyyy-MM-dd HH:mm:ss') : null,
      remarks: Random.boolean() ? Random.csentence(5, 15) : '',
      createdAt: createTime,
      updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }

  return shippings
}

let shippings = generateShippings(50)

export default [
  // 获取配送列表
  {
    url: '/api/shippings',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search, status, shippingMethod, sortBy, sortOrder } = query

      let filteredShippings = [...shippings]

      // 搜索过滤
      if (search) {
        filteredShippings = filteredShippings.filter(shipping =>
          shipping.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
          shipping.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          shipping.recipient.name.toLowerCase().includes(search.toLowerCase()) ||
          shipping.recipient.phone.includes(search)
        )
      }

      // 状态过滤
      if (status && status !== 'all') {
        filteredShippings = filteredShippings.filter(shipping => shipping.status === status)
      }

      // 配送方式过滤
      if (shippingMethod && shippingMethod !== 'all') {
        filteredShippings = filteredShippings.filter(shipping => shipping.shippingMethod === shippingMethod)
      }

      // 排序
      if (sortBy) {
        filteredShippings.sort((a, b) => {
          const order = sortOrder === 'desc' ? -1 : 1
          if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
            return order * (new Date(a[sortBy]) - new Date(b[sortBy]))
          }
          return order * (a[sortBy] - b[sortBy])
        })
      }

      const start = (page - 1) * pageSize
      const end = start + Number(pageSize)
      const paginatedShippings = filteredShippings.slice(start, end)

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: paginatedShippings,
          total: filteredShippings.length,
          page: Number(page),
          pageSize: Number(pageSize)
        }
      }
    }
  },

  // 获取单个配送详情
  {
    url: /\/api\/shippings\/(\d+)/,
    method: 'get',
    response: ({ url }) => {
      const id = Number(url.match(/\/api\/shippings\/(\d+)/)[1])
      const shipping = shippings.find(s => s.id === id)

      if (shipping) {
        return {
          code: 200,
          message: '获取成功',
          data: shipping
        }
      }

      return {
        code: 404,
        message: '配送信息不存在',
        data: null
      }
    }
  },

  // 创建配送
  {
    url: '/api/shippings',
    method: 'post',
    response: ({ body }) => {
      const newShipping = {
        id: shippings.length + 1,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      shippings.unshift(newShipping)

      return {
        code: 200,
        message: '创建成功',
        data: newShipping
      }
    }
  },

  // 更新配送
  {
    url: /\/api\/shippings\/(\d+)/,
    method: 'put',
    response: ({ url, body }) => {
      const id = Number(url.match(/\/api\/shippings\/(\d+)/)[1])
      const index = shippings.findIndex(s => s.id === id)

      if (index !== -1) {
        shippings[index] = {
          ...shippings[index],
          ...body,
          updatedAt: new Date().toISOString()
        }

        return {
          code: 200,
          message: '更新成功',
          data: shippings[index]
        }
      }

      return {
        code: 404,
        message: '配送信息不存在',
        data: null
      }
    }
  },

  // 删除配送
  {
    url: /\/api\/shippings\/(\d+)/,
    method: 'delete',
    response: ({ url }) => {
      const id = Number(url.match(/\/api\/shippings\/(\d+)/)[1])
      const index = shippings.findIndex(s => s.id === id)

      if (index !== -1) {
        shippings.splice(index, 1)

        return {
          code: 200,
          message: '删除成功',
          data: null
        }
      }

      return {
        code: 404,
        message: '配送信息不存在',
        data: null
      }
    }
  },

  // 批量删除
  {
    url: '/api/shippings/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      shippings = shippings.filter(shipping => !ids.includes(shipping.id))

      return {
        code: 200,
        message: `成功删除 ${ids.length} 条配送信息`,
        data: null
      }
    }
  },

  // 批量更新状态
  {
    url: '/api/shippings/batch-status',
    method: 'post',
    response: ({ body }) => {
      const { ids, status } = body

      shippings = shippings.map(shipping => {
        if (ids.includes(shipping.id)) {
          return {
            ...shipping,
            status,
            updatedAt: new Date().toISOString()
          }
        }
        return shipping
      })

      return {
        code: 200,
        message: `成功更新 ${ids.length} 条配送状态`,
        data: null
      }
    }
  },

  // 更新配送状态
  {
    url: /\/api\/shippings\/(\d+)\/status/,
    method: 'post',
    response: ({ url, body }) => {
      const id = Number(url.match(/\/api\/shippings\/(\d+)/)[1])
      const { status } = body
      const index = shippings.findIndex(s => s.id === id)

      if (index !== -1) {
        shippings[index] = {
          ...shippings[index],
          status,
          updatedAt: new Date().toISOString()
        }

        return {
          code: 200,
          message: '状态更新成功',
          data: shippings[index]
        }
      }

      return {
        code: 404,
        message: '配送信息不存在',
        data: null
      }
    }
  },

  // 导出配送
  {
    url: '/api/shippings/export',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '导出成功',
        data: shippings
      }
    }
  },

  // 导入配送
  {
    url: '/api/shippings/import',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '导入成功',
        data: null
      }
    }
  }
]
