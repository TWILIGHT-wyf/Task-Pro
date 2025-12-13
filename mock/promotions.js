// 模拟促销数据
let promotions = [
  {
    id: 1,
    name: '春节特惠',
    description: '春节期间全场8折',
    type: 'discount', // discount, coupon, buy_one_get_one, free_shipping, flash_sale
    discountValue: 0.8,
    discountType: 'percentage', // percentage, fixed
    startDate: '2024-02-01 00:00:00',
    endDate: '2024-02-15 23:59:59',
    status: 1, // 1: 启用, 0: 禁用
    priority: 1,
    applicableProducts: [], // 空数组表示全场适用
    applicableCategories: [],
    minOrderAmount: 0,
    maxDiscountAmount: 1000,
    usageLimit: 0, // 0表示无限制
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '新用户优惠券',
    description: '新注册用户专享优惠券',
    type: 'coupon',
    discountValue: 50,
    discountType: 'fixed',
    startDate: '2024-01-01 00:00:00',
    endDate: '2024-12-31 23:59:59',
    status: 1,
    priority: 2,
    applicableProducts: [],
    applicableCategories: [],
    minOrderAmount: 100,
    maxDiscountAmount: 50,
    usageLimit: 1,
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    name: '买一送一',
    description: '指定商品买一送一',
    type: 'buy_one_get_one',
    discountValue: 1,
    discountType: 'percentage',
    startDate: '2024-03-01 00:00:00',
    endDate: '2024-03-31 23:59:59',
    status: 1,
    priority: 3,
    applicableProducts: [1, 2], // 适用于商品ID 1和2
    applicableCategories: [],
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00'
  },
  {
    id: 4,
    name: '满减优惠',
    description: '满200减50',
    type: 'discount',
    discountValue: 50,
    discountType: 'fixed',
    startDate: '2024-04-01 00:00:00',
    endDate: '2024-04-30 23:59:59',
    status: 1,
    priority: 4,
    applicableProducts: [],
    applicableCategories: [],
    minOrderAmount: 200,
    maxDiscountAmount: 50,
    usageLimit: 0,
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00'
  },
  {
    id: 5,
    name: '限时秒杀',
    description: 'iPhone 15 Pro限时秒杀',
    type: 'flash_sale',
    discountValue: 0.7,
    discountType: 'percentage',
    startDate: '2024-05-01 10:00:00',
    endDate: '2024-05-01 12:00:00',
    status: 1,
    priority: 5,
    applicableProducts: [1], // 仅适用于iPhone 15 Pro
    applicableCategories: [],
    minOrderAmount: 0,
    maxDiscountAmount: 2000,
    usageLimit: 10,
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-05 10:00:00',
    updateTime: '2024-01-05 10:00:00'
  },
  {
    id: 6,
    name: '全场包邮',
    description: '全场商品包邮',
    type: 'free_shipping',
    discountValue: 0,
    discountType: 'fixed',
    startDate: '2024-06-01 00:00:00',
    endDate: '2024-06-30 23:59:59',
    status: 1,
    priority: 6,
    applicableProducts: [],
    applicableCategories: [],
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-06 10:00:00',
    updateTime: '2024-01-06 10:00:00'
  },
  {
    id: 7,
    name: '双11狂欢',
    description: '双11全场5折',
    type: 'discount',
    discountValue: 0.5,
    discountType: 'percentage',
    startDate: '2024-11-11 00:00:00',
    endDate: '2024-11-11 23:59:59',
    status: 0, // 禁用状态
    priority: 7,
    applicableProducts: [],
    applicableCategories: [],
    minOrderAmount: 0,
    maxDiscountAmount: 500,
    usageLimit: 0,
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-07 10:00:00',
    updateTime: '2024-01-07 10:00:00'
  },
  {
    id: 8,
    name: '学生专享',
    description: '学生认证用户9折',
    type: 'discount',
    discountValue: 0.9,
    discountType: 'percentage',
    startDate: '2024-09-01 00:00:00',
    endDate: '2024-12-31 23:59:59',
    status: 1,
    priority: 8,
    applicableProducts: [],
    applicableCategories: [],
    minOrderAmount: 0,
    maxDiscountAmount: 200,
    usageLimit: 0,
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-08 10:00:00',
    updateTime: '2024-01-08 10:00:00'
  },
  {
    id: 9,
    name: '周年庆优惠',
    description: '网站周年庆特惠',
    type: 'discount',
    discountValue: 100,
    discountType: 'fixed',
    startDate: '2024-10-01 00:00:00',
    endDate: '2024-10-31 23:59:59',
    status: 1,
    priority: 9,
    applicableProducts: [],
    applicableCategories: [2, 3], // 适用于手机和电脑分类
    minOrderAmount: 500,
    maxDiscountAmount: 100,
    usageLimit: 0,
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-09 10:00:00',
    updateTime: '2024-01-09 10:00:00'
  },
  {
    id: 10,
    name: '清仓特卖',
    description: '库存清仓，3折起',
    type: 'discount',
    discountValue: 0.3,
    discountType: 'percentage',
    startDate: '2024-12-01 00:00:00',
    endDate: '2024-12-31 23:59:59',
    status: 1,
    priority: 10,
    applicableProducts: [],
    applicableCategories: [],
    minOrderAmount: 0,
    maxDiscountAmount: 300,
    usageLimit: 0,
    usedCount: 0,
    participants: 0, // 参与人数
    totalDiscount: 0, // 累计优惠金额
    createTime: '2024-01-10 10:00:00',
    updateTime: '2024-01-10 10:00:00'
  }
]

export default [
  // 获取促销列表
  {
    url: '/api/promotions',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page) || 1
      const size = parseInt(query.size) || 10
      const start = (page - 1) * size
      const end = start + size
      let filteredList = promotions
      let totalRecords = promotions.length

      // 搜索过滤
      if (query.keyword) {
        filteredList = promotions.filter(promotion =>
          promotion.name.includes(query.keyword) ||
          promotion.description.includes(query.keyword)
        )
        totalRecords = filteredList.length
      }

      // 类型过滤
      if (query.type) {
        filteredList = filteredList.filter(promotion => promotion.type === query.type)
        totalRecords = filteredList.length
      }

      // 状态过滤
      if (query.status !== undefined && query.status !== '') {
        filteredList = filteredList.filter(promotion => promotion.status == query.status)
        totalRecords = filteredList.length
      }

      // 日期范围过滤
      if (query.startDate) {
        filteredList = filteredList.filter(promotion => promotion.startDate >= query.startDate)
        totalRecords = filteredList.length
      }
      if (query.endDate) {
        filteredList = filteredList.filter(promotion => promotion.endDate <= query.endDate)
        totalRecords = filteredList.length
      }

      // 排序
      if (query.sortBy && query.sortOrder) {
        filteredList.sort((a, b) => {
          let aValue = a[query.sortBy]
          let bValue = b[query.sortBy]

          // 处理时间字段
          if (query.sortBy === 'createTime' || query.sortBy === 'updateTime' || query.sortBy === 'startDate' || query.sortBy === 'endDate') {
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

  // 获取单个促销详情
  {
    url: '/api/promotions/:id',
    method: 'get',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop())
      const promotion = promotions.find(p => p.id === id)
      if (promotion) {
        return {
          code: 0,
          data: promotion
        }
      } else {
        return {
          code: 1,
          message: '促销不存在'
        }
      }
    }
  },

  // 添加促销
  {
    url: '/api/promotions',
    method: 'post',
    response: ({ body }) => {
      const newPromotion = {
        id: promotions.length + 1,
        ...body,
        createTime: body.createTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      promotions.push(newPromotion)
      return {
        code: 0,
        message: '添加成功',
        data: newPromotion
      }
    }
  },

  // 删除促销
  {
    url: '/api/promotions/:id',
    method: 'delete',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop())
      const index = promotions.findIndex(promotion => promotion.id === id)
      if (index > -1) {
        promotions.splice(index, 1)
        return {
          code: 0,
          message: '删除成功'
        }
      } else {
        return {
          code: 1,
          message: '促销不存在'
        }
      }
    }
  },

  // 编辑促销
  {
    url: '/api/promotions/:id',
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.split('/').pop())
      const promotion = promotions.find(p => p.id === id)
      if (promotion) {
        Object.assign(promotion, body)
        promotion.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        return {
          code: 0,
          message: '编辑成功'
        }
      } else {
        return {
          code: 1,
          message: '促销不存在'
        }
      }
    }
  },

  // 批量删除促销
  {
    url: '/api/promotions/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let deletedCount = 0
      ids.forEach(id => {
        const index = promotions.findIndex(promotion => promotion.id === id)
        if (index > -1) {
          promotions.splice(index, 1)
          deletedCount++
        }
      })
      return {
        code: 0,
        message: `成功删除 ${deletedCount} 个促销`,
        data: { deletedCount }
      }
    }
  },

  // 获取促销统计
  {
    url: '/api/promotions/stats',
    method: 'get',
    response: () => {
      const total = promotions.length
      const active = promotions.filter(p => p.status === 1).length
      const inactive = promotions.filter(p => p.status === 0).length
      const expiringSoon = promotions.filter(p => {
        const endDate = new Date(p.endDate)
        const now = new Date()
        const diffTime = endDate - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 7 && diffDays >= 0 && p.status === 1
      }).length

      // 计算总优惠金额和参与人数（模拟数据）
      const totalDiscount = promotions.reduce((sum, p) => sum + (p.usedCount * (p.discountType === 'fixed' ? p.discountValue : 100 * p.discountValue)), 0)
      const totalParticipants = promotions.reduce((sum, p) => sum + p.usedCount, 0)

      return {
        code: 0,
        data: {
          total,
          active,
          inactive,
          expiringSoon,
          totalDiscount,
          totalParticipants
        }
      }
    }
  },

  // 切换促销状态
  {
    url: '/api/promotions/:id/toggle-status',
    method: 'put',
    response: ({ url }) => {
      const match = url.match(/\/api\/promotions\/(\d+)\/toggle-status/)
      const id = match ? parseInt(match[1]) : NaN
      const promotion = promotions.find(p => p.id === id)
      if (promotion) {
        promotion.status = promotion.status === 1 ? 0 : 1
        promotion.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        return {
          code: 0,
          message: '状态切换成功',
          data: { status: promotion.status }
        }
      } else {
        return {
          code: 1,
          message: '促销不存在'
        }
      }
    }
  },

  // 批量启用促销
  {
    url: '/api/promotions/batch-enable',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let enabledCount = 0
      ids.forEach(id => {
        const promotion = promotions.find(p => p.id === id)
        if (promotion && promotion.status === 0) {
          promotion.status = 1
          promotion.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
          enabledCount++
        }
      })
      return {
        code: 0,
        message: `成功启用 ${enabledCount} 个促销`,
        data: { enabledCount }
      }
    }
  },

  // 批量禁用促销
  {
    url: '/api/promotions/batch-disable',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let disabledCount = 0
      ids.forEach(id => {
        const promotion = promotions.find(p => p.id === id)
        if (promotion && promotion.status === 1) {
          promotion.status = 0
          promotion.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
          disabledCount++
        }
      })
      return {
        code: 0,
        message: `成功禁用 ${disabledCount} 个促销`,
        data: { disabledCount }
      }
    }
  },

  // 导出促销数据
  {
    url: '/api/promotions/export',
    method: 'get',
    response: ({ query }) => {
      let exportData = promotions

      // 应用过滤条件（与列表查询相同）
      if (query.keyword) {
        exportData = promotions.filter(promotion =>
          promotion.name.includes(query.keyword) ||
          promotion.description.includes(query.keyword)
        )
      }
      if (query.type) {
        exportData = exportData.filter(promotion => promotion.type === query.type)
      }
      if (query.status !== undefined && query.status !== '') {
        exportData = exportData.filter(promotion => promotion.status == query.status)
      }

      return {
        code: 0,
        data: exportData,
        message: `导出 ${exportData.length} 条促销数据`
      }
    }
  }
]
