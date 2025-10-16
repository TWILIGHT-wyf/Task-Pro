// 模拟分类数据
let categories = [


  {
    id: 1,
    name: '电子产品',
    description: '各种电子设备和配件',
    parentId: null,
    sort: 1,
    status: 1, // 1: 启用, 0: 禁用
    icon: 'https://via.placeholder.com/30',
    productCount: 25,
    customAttrs: ['热门'],
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 2,
    name: '手机',
    description: '智能手机等',
    parentId: 1,
    sort: 2,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 15,
    customAttrs: ['推荐'],
    createTime: '2023-01-02 10:00:00'
  },
  {
    id: 3,
    name: '电脑',
    description: '笔记本电脑等',
    parentId: 1,
    sort: 3,
    status: 0,
    icon: 'https://via.placeholder.com/30',
    productCount: 8,
    customAttrs: ['新品'],
    createTime: '2023-01-03 10:00:00'
  },
  {
    id: 4,
    name: '服装',
    description: '男装、女装、童装等',
    parentId: null,
    sort: 4,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 32,
    customAttrs: ['促销'],
    createTime: '2023-01-04 10:00:00'
  },
  {
    id: 5,
    name: '男装',
    description: '男士服装',
    parentId: 4,
    sort: 5,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 18,
    customAttrs: ['热销'],
    createTime: '2023-01-05 10:00:00'
  },
  {
    id: 6,
    name: '女装',
    description: '女士服装',
    parentId: 4,
    sort: 6,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 22,
    customAttrs: ['时尚'],
    createTime: '2023-01-06 10:00:00'
  },
  {
    id: 7,
    name: '食品',
    description: '各类食品和饮料',
    parentId: null,
    sort: 7,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 45,
    customAttrs: ['新鲜'],
    createTime: '2023-01-07 10:00:00'
  },
  {
    id: 8,
    name: '水果',
    description: '新鲜水果',
    parentId: 7,
    sort: 8,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 12,
    customAttrs: ['有机'],
    createTime: '2023-01-08 10:00:00'
  },
  {
    id: 9,
    name: '饮料',
    description: '各类饮料',
    parentId: 7,
    sort: 9,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 20,
    customAttrs: ['清凉'],
    createTime: '2023-01-09 10:00:00'
  },
  {
    id: 10,
    name: '家居',
    description: '家居用品和装饰',
    parentId: null,
    sort: 10,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 28,
    customAttrs: ['舒适'],
    createTime: '2023-01-10 10:00:00'
  },
  {
    id: 11,
    name: '家具',
    description: '各类家具',
    parentId: 10,
    sort: 11,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 15,
    customAttrs: ['耐用'],
    createTime: '2023-01-11 10:00:00'
  },
  {
    id: 12,
    name: '装饰品',
    description: '家居装饰',
    parentId: 10,
    sort: 12,
    status: 0,
    icon: 'https://via.placeholder.com/30',
    productCount: 10,
    customAttrs: ['精美'],
    createTime: '2023-01-12 10:00:00'
  },
  {
    id: 13,
    name: '书籍',
    description: '各类书籍和杂志',
    parentId: null,
    sort: 13,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 50,
    customAttrs: ['知识'],
    createTime: '2023-01-13 10:00:00'
  },
  {
    id: 14,
    name: '小说',
    description: '各类小说',
    parentId: 13,
    sort: 14,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 30,
    customAttrs: ['畅销'],
    createTime: '2023-01-14 10:00:00'
  },
  {
    id: 15,
    name: '教材',
    description: '教育教材',
    parentId: 13,
    sort: 15,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 20,
    customAttrs: ['必备'],
    createTime: '2023-01-15 10:00:00'
  },
  {
    id: 16,
    name: '体育用品',
    description: '各类体育器材',
    parentId: null,
    sort: 16,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 35,
    customAttrs: ['专业'],
    createTime: '2023-01-16 10:00:00'
  },
  {
    id: 17,
    name: '球类',
    description: '足球、篮球等',
    parentId: 16,
    sort: 17,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 18,
    customAttrs: ['竞技'],
    createTime: '2023-01-17 10:00:00'
  },
  {
    id: 18,
    name: '健身器材',
    description: '哑铃、跑步机等',
    parentId: 16,
    sort: 18,
    status: 0,
    icon: 'https://via.placeholder.com/30',
    productCount: 12,
    customAttrs: ['健康'],
    createTime: '2023-01-18 10:00:00'
  },
  {
    id: 19,
    name: '美妆',
    description: '化妆品和护肤品',
    parentId: null,
    sort: 19,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 40,
    customAttrs: ['美丽'],
    createTime: '2023-01-19 10:00:00'
  },
  {
    id: 20,
    name: '护肤',
    description: '护肤产品',
    parentId: 19,
    sort: 20,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 25,
    customAttrs: ['天然'],
    createTime: '2023-01-20 10:00:00'
  },
  {
    id: 21,
    name: '化妆',
    description: '化妆用品',
    parentId: 19,
    sort: 21,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 15,
    customAttrs: ['时尚'],
    createTime: '2023-01-21 10:00:00'
  },
  {
    id: 22,
    name: '母婴',
    description: '母婴用品',
    parentId: null,
    sort: 22,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 30,
    customAttrs: ['安全'],
    createTime: '2023-01-22 10:00:00'
  },
  {
    id: 23,
    name: '奶粉',
    description: '婴儿奶粉',
    parentId: 22,
    sort: 23,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 10,
    customAttrs: ['营养'],
    createTime: '2023-01-23 10:00:00'
  },
  {
    id: 24,
    name: '玩具',
    description: '儿童玩具',
    parentId: 22,
    sort: 24,
    status: 0,
    icon: 'https://via.placeholder.com/30',
    productCount: 20,
    customAttrs: ['趣味'],
    createTime: '2023-01-24 10:00:00'
  },
  {
    id: 25,
    name: '汽车用品',
    description: '汽车配件和保养品',
    parentId: null,
    sort: 25,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 22,
    customAttrs: ['实用'],
    createTime: '2023-01-25 10:00:00'
  },
  {
    id: 26,
    name: '配件',
    description: '汽车配件',
    parentId: 25,
    sort: 26,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 15,
    customAttrs: ['耐用'],
    createTime: '2023-01-26 10:00:00'
  },
  {
    id: 27,
    name: '保养',
    description: '汽车保养品',
    parentId: 25,
    sort: 27,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 7,
    customAttrs: ['环保'],
    createTime: '2023-01-27 10:00:00'
  },
  {
    id: 28,
    name: '宠物用品',
    description: '宠物食品和用品',
    parentId: null,
    sort: 28,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 18,
    customAttrs: ['爱心'],
    createTime: '2023-01-28 10:00:00'
  },
  {
    id: 29,
    name: '宠物食品',
    description: '宠物粮等',
    parentId: 28,
    sort: 29,
    status: 1,
    icon: 'https://via.placeholder.com/30',
    productCount: 12,
    customAttrs: ['营养'],
    createTime: '2023-01-29 10:00:00'
  },
  {
    id: 30,
    name: '宠物玩具',
    description: '宠物玩具',
    parentId: 28,
    sort: 30,
    status: 0,
    icon: 'https://via.placeholder.com/30',
    productCount: 6,
    customAttrs: ['有趣'],
    createTime: '2023-01-30 10:00:00'
  }
]

export default [
  // 获取分类列表
  {
    url: '/api/categories',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page) || 1
      const size = parseInt(query.size) || 10
      const start = (page - 1) * size
      const end = start + size
      let filteredList = categories
      let totalRecords = categories.length

      // 搜索过滤
      if (query.keyword) {
        // 递归搜索函数，收集所有匹配的分类及其子分类
        const collectMatchingCategories = (list, keyword) => {
          const result = []
          const isMatch = (item) => item.name.includes(keyword)

          list.forEach(item => {
            if (isMatch(item)) {
              // 如果匹配，添加整个分支
              result.push(item)
              // 添加所有子分类
              const children = list.filter(child => child.parentId === item.id)
              result.push(...children)
            } else {
              // 如果不匹配，检查子分类
              const children = list.filter(child => child.parentId === item.id)
              const matchingChildren = collectMatchingCategories(children, keyword)
              if (matchingChildren.length > 0) {
                // 如果有匹配的子分类，添加父分类和匹配的子
                result.push(item)
                result.push(...matchingChildren)
              }
            }
          })
          return result
        }

        filteredList = collectMatchingCategories(categories, query.keyword)
        // 去重
        filteredList = filteredList.filter((item, index, self) =>
          self.findIndex(c => c.id === item.id) === index
        )
        totalRecords = filteredList.length
      }

      // 分页
      const paginatedList = filteredList.slice(start,end)
      return {
        code: 0,
        data: {
          list: paginatedList,
          totalRecords: totalRecords
        }
      }
    }
  },
  // 添加分类
  {
    url: '/api/categories',
    method: 'post',
    response: ({ body }) => {
      const newCategory = {
        id: categories.length + 1,
        ...body,
        createTime: body.createTime || new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      categories.push(newCategory)
      console.log(categories)
      return {
        code: 0,
        message: '添加成功',
        data: newCategory
      }
    }
  },
  // 删除分类
  {
    url: '/api/categories/:id',
    method: 'delete',
    response: ({ url }) => {
      const id = url.split('/').pop()
      const index = categories.findIndex(cat => cat.id == id)
      if (index > -1) {
        categories.splice(index, 1)
        return {
          code: 0,
          message: '删除成功'
        }
      } else {
        return {
          code: 1,
          message: '分类不存在'
        }
      }
    }
  },
  // 编辑分类
  {
    url: '/api/categories/:id',
    method: 'patch',
    response: ({ url, body }) => {
      const id = url.split('/').pop()
      const category = categories.find(cat => cat.id == id)
      if (category) {
        Object.assign(category, body)
        console.log(category)
        return {
          code: 0,
          message: '编辑成功'
        }
      } else {
        return {
          code: 1,
          message: '分类不存在'
        }
      }
    }
  },

  // 批量删除分类
  {
    url: '/api/categories/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let deletedCount = 0
      ids.forEach(id => {
        const index = categories.findIndex(category => category.id === id)
        if (index > -1) {
          categories.splice(index, 1)
          deletedCount++
        }
      })
      return {
        code: 0,
        message: `成功删除 ${deletedCount} 个分类`,
        data: { deletedCount }
      }
    }
  },

  // 获取分类统计
  {
    url: '/api/categories/stats',
    method: 'get',
    response: () => {
      const total = categories.length
      const active = categories.filter(c => c.status === 1).length
      const inactive = categories.filter(c => c.status === 0).length
      const withProducts = categories.filter(c => c.productCount > 0).length

      return {
        code: 0,
        data: {
          total,
          active,
          inactive,
          withProducts
        }
      }
    }
  },

  // 切换分类状态
  {
    url: '/api/categories/:id/toggle-status',
    method: 'put',
    response: ({ url }) => {
      
      const urlParts = url.split('/')
      const idIndex = urlParts.findIndex(part => part === 'categories') + 1
      const id = parseInt(urlParts[idIndex])

      const category = categories.find(c => c.id === id)
      if (category) {
        category.status = category.status === 1 ? 0 : 1
        return {
          code: 0,
          message: '状态切换成功',
          data: { status: category.status }
        }
      } else {
        return {
          code: 1,
          message: '分类不存在'
        }
      }
    }
  },

  // 批量启用分类
  {
    url: '/api/categories/batch-enable',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let enabledCount = 0
      ids.forEach(id => {
        const category = categories.find(c => c.id === id)
        if (category && category.status === 0) {
          category.status = 1
          enabledCount++
        }
      })
      return {
        code: 0,
        message: `成功启用 ${enabledCount} 个分类`,
        data: { enabledCount }
      }
    }
  },

  // 批量禁用分类
  {
    url: '/api/categories/batch-disable',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let disabledCount = 0
      ids.forEach(id => {
        const category = categories.find(c => c.id === id)
        if (category && category.status === 1) {
          category.status = 0
          disabledCount++
        }
      })
      return {
        code: 0,
        message: `成功禁用 ${disabledCount} 个分类`,
        data: { disabledCount }
      }
    }
  },

  // 导出分类数据
  {
    url: '/api/categories/export',
    method: 'get',
    response: ({ query }) => {
      let exportData = categories

      // 应用过滤条件
      if (query.keyword) {
        exportData = categories.filter(category =>
          category.name.includes(query.keyword) ||
          category.description.includes(query.keyword)
        )
      }
      if (query.status !== undefined && query.status !== '') {
        exportData = exportData.filter(category => category.status == query.status)
      }

      return {
        code: 0,
        data: exportData,
        message: `导出 ${exportData.length} 条分类数据`
      }
    }
  }
]
