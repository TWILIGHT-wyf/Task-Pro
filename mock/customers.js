// 模拟会员数据
let customers = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    createdAt: '2023-01-01',
    status: 'active'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138001',
    createdAt: '2023-01-02',
    status: 'active'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138002',
    createdAt: '2023-01-03',
    status: 'inactive'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13800138003',
    createdAt: '2023-01-04',
    status: 'active'
  },
  {
    id: 5,
    name: '孙七',
    email: 'sunqi@example.com',
    phone: '13800138004',
    createdAt: '2023-01-05',
    status: 'active'
  },
  {
    id: 6,
    name: '周八',
    email: 'zhouba@example.com',
    phone: '13800138005',
    createdAt: '2023-01-06',
    status: 'inactive'
  },
  {
    id: 7,
    name: '吴九',
    email: 'wujiu@example.com',
    phone: '13800138006',
    createdAt: '2023-01-07',
    status: 'active'
  },
  {
    id: 8,
    name: '郑十',
    email: 'zhengshi@example.com',
    phone: '13800138007',
    createdAt: '2023-01-08',
    status: 'active'
  },
  {
    id: 9,
    name: '陈十一',
    email: 'chenshiyi@example.com',
    phone: '13800138008',
    createdAt: '2023-01-09',
    status: 'inactive'
  },
  {
    id: 10,
    name: '林十二',
    email: 'linshier@example.com',
    phone: '13800138009',
    createdAt: '2023-01-10',
    status: 'active'
  },
  {
    id: 11,
    name: '黄十三',
    email: 'huangshisan@example.com',
    phone: '13800138010',
    createdAt: '2023-01-11',
    status: 'active'
  },
  {
    id: 12,
    name: '徐十四',
    email: 'xushisi@example.com',
    phone: '13800138011',
    createdAt: '2023-01-12',
    status: 'inactive'
  },
  {
    id: 13,
    name: '朱十五',
    email: 'zhushiwu@example.com',
    phone: '13800138012',
    createdAt: '2023-01-13',
    status: 'active'
  },
  {
    id: 14,
    name: '马十六',
    email: 'mashiliu@example.com',
    phone: '13800138013',
    createdAt: '2023-01-14',
    status: 'active'
  },
  {
    id: 15,
    name: '胡十七',
    email: 'hushiqi@example.com',
    phone: '13800138014',
    createdAt: '2023-01-15',
    status: 'inactive'
  },
  {
    id: 16,
    name: '郭十八',
    email: 'guoshiba@example.com',
    phone: '13800138015',
    createdAt: '2023-01-16',
    status: 'active'
  },
  {
    id: 17,
    name: '何十九',
    email: 'heshijiu@example.com',
    phone: '13800138016',
    createdAt: '2023-01-17',
    status: 'active'
  },
  {
    id: 18,
    name: '高二十',
    email: 'gaoershi@example.com',
    phone: '13800138017',
    createdAt: '2023-01-18',
    status: 'inactive'
  },
  {
    id: 19,
    name: '罗二十一',
    email: 'luoershiyi@example.com',
    phone: '13800138018',
    createdAt: '2023-01-19',
    status: 'active'
  },
  {
    id: 20,
    name: '杨二十二',
    email: 'yangershier@example.com',
    phone: '13800138019',
    createdAt: '2023-01-20',
    status: 'active'
  }
]

export default [
  // 获取会员列表
  {
    url: '/api/customers',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page) || 1
      const size = parseInt(query.size) || 10
      const start = (page - 1) * size
      const end = start + size
      let filteredList = customers
      let totalRecords = customers.length

      // 搜索过滤
      if (query.keyword) {
        filteredList = customers.filter(customer =>
          customer.name.includes(query.keyword) ||
          customer.email.includes(query.keyword) ||
          customer.phone.includes(query.keyword)
        )
        totalRecords = filteredList.length
      }

      // 状态过滤
      if (query.status !== undefined && query.status !== '') {
        filteredList = filteredList.filter(customer => customer.status === query.status)
        totalRecords = filteredList.length
      }

      // 排序（如果需要）
      if (query.sortBy && query.sortOrder) {
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

  // 添加会员
  {
    url: '/api/customers',
    method: 'post',
    response: ({ body }) => {
      const newCustomer = {
        id: customers.length + 1,
        ...body,
        createdAt: body.createdAt || new Date().toISOString().split('T')[0]
      }
      customers.push(newCustomer)
      return {
        code: 0,
        message: '添加成功',
        data: newCustomer
      }
    }
  },

  // 删除会员
  {
    url: '/api/customers/:id',
    method: 'delete',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop())
      const index = customers.findIndex(customer => customer.id === id)
      if (index > -1) {
        customers.splice(index, 1)
        return {
          code: 0,
          message: '删除成功'
        }
      } else {
        return {
          code: 1,
          message: '会员不存在'
        }
      }
    }
  },

  // 更新会员
  {
    url: '/api/customers/:id',
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.split('/').pop())
      const customer = customers.find(customer => customer.id === id)
      if (customer) {
        Object.assign(customer, body)
        return {
          code: 0,
          message: '更新成功',
          data: customer
        }
      } else {
        return {
          code: 1,
          message: '会员不存在'
        }
      }
    }
  },

  // 批量删除会员
  {
    url: '/api/customers/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let deletedCount = 0
      ids.forEach(id => {
        const index = customers.findIndex(customer => customer.id === id)
        if (index > -1) {
          customers.splice(index, 1)
          deletedCount++
        }
      })
      return {
        code: 0,
        message: `成功删除 ${deletedCount} 个会员`,
        data: { deletedCount }
      }
    }
  },

  // 获取会员统计
  {
    url: '/api/customers/stats',
    method: 'get',
    response: () => {
      const total = customers.length
      const active = customers.filter(c => c.status === 'active').length
      const inactive = customers.filter(c => c.status === 'inactive').length

      return {
        code: 0,
        data: {
          total,
          active,
          inactive
        }
      }
    }
  },

  // 切换会员状态
  {
    url: '/api/customers/:id/toggle-status',
    method: 'put',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop())
      const customer = customers.find(c => c.id === id)
      if (customer) {
        customer.status = customer.status === 'active' ? 'inactive' : 'active'
        return {
          code: 0,
          message: '状态切换成功',
          data: { status: customer.status }
        }
      } else {
        return {
          code: 1,
          message: '会员不存在'
        }
      }
    }
  },

  // 批量启用会员
  {
    url: '/api/customers/batch-enable',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let enabledCount = 0
      ids.forEach(id => {
        const customer = customers.find(c => c.id === id)
        if (customer && customer.status === 'inactive') {
          customer.status = 'active'
          enabledCount++
        }
      })
      return {
        code: 0,
        message: `成功启用 ${enabledCount} 个会员`,
        data: { enabledCount }
      }
    }
  },

  // 批量禁用会员
  {
    url: '/api/customers/batch-disable',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let disabledCount = 0
      ids.forEach(id => {
        const customer = customers.find(c => c.id === id)
        if (customer && customer.status === 'active') {
          customer.status = 'inactive'
          disabledCount++
        }
      })
      return {
        code: 0,
        message: `成功禁用 ${disabledCount} 个会员`,
        data: { disabledCount }
      }
    }
  },

  // 导出会员数据
  {
    url: '/api/customers/export',
    method: 'get',
    response: ({ query }) => {
      let exportData = customers

      // 应用过滤条件
      if (query.keyword) {
        exportData = customers.filter(customer =>
          customer.name.includes(query.keyword) ||
          customer.email.includes(query.keyword) ||
          customer.phone.includes(query.keyword)
        )
      }
      if (query.status) {
        exportData = exportData.filter(customer => customer.status === query.status)
      }

      return {
        code: 0,
        data: exportData,
        message: `导出 ${exportData.length} 条会员数据`
      }
    }
  }
]


