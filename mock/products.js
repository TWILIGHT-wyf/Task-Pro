// 模拟商品数据
let products = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: '苹果最新旗舰手机，搭载A17 Pro芯片',
    categoryId: 2, // 手机分类
    price: 7999,
    originalPrice: 8999,
    stock: 50,
    status: 1, // 1: 上架, 0: 下架
    images: ['https://via.placeholder.com/300x300?text=iPhone+15+Pro'],
    sales: 120,
    rating: 4.8,
    brand: 'Apple',
    weight: 187,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: 'MacBook Pro 16寸',
    description: '专业级笔记本电脑，M3 Max芯片',
    categoryId: 3, // 电脑分类
    price: 19999,
    originalPrice: 21999,
    stock: 20,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=MacBook+Pro'],
    sales: 35,
    rating: 4.9,
    brand: 'Apple',
    weight: 2150,
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    name: 'Nike Air Max',
    description: '经典运动鞋，舒适透气',
    categoryId: 4, // 服装分类
    price: 899,
    originalPrice: 999,
    stock: 100,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Nike+Air+Max'],
    sales: 200,
    rating: 4.6,
    brand: 'Nike',
    weight: 320,
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00'
  },
  {
    id: 4,
    name: 'Adidas T恤',
    description: '纯棉T恤，舒适透气',
    categoryId: 5, // 男装分类
    price: 199,
    originalPrice: 229,
    stock: 150,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Adidas+T-shirt'],
    sales: 80,
    rating: 4.4,
    brand: 'Adidas',
    weight: 180,
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00'
  },
  {
    id: 5,
    name: 'Zara连衣裙',
    description: '时尚连衣裙，优雅大方',
    categoryId: 6, // 女装分类
    price: 599,
    originalPrice: 699,
    stock: 80,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Zara+Dress'],
    sales: 65,
    rating: 4.5,
    brand: 'Zara',
    weight: 250,
    createTime: '2024-01-05 10:00:00',
    updateTime: '2024-01-05 10:00:00'
  },
  {
    id: 6,
    name: '有机苹果',
    description: '新鲜有机苹果，富含维生素',
    categoryId: 8, // 水果分类
    price: 15.8,
    originalPrice: 18.8,
    stock: 200,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Organic+Apple'],
    sales: 150,
    rating: 4.7,
    brand: '有机农场',
    weight: 200,
    createTime: '2024-01-06 10:00:00',
    updateTime: '2024-01-06 10:00:00'
  },
  {
    id: 7,
    name: '可口可乐',
    description: '经典碳酸饮料，清爽解渴',
    categoryId: 9, // 饮料分类
    price: 3.5,
    originalPrice: 4.0,
    stock: 500,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Coca+Cola'],
    sales: 300,
    rating: 4.3,
    brand: '可口可乐',
    weight: 330,
    createTime: '2024-01-07 10:00:00',
    updateTime: '2024-01-07 10:00:00'
  },
  {
    id: 8,
    name: '宜家沙发',
    description: '现代简约风格沙发，舒适耐用',
    categoryId: 11, // 家具分类
    price: 2999,
    originalPrice: 3499,
    stock: 15,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=IKEA+Sofa'],
    sales: 12,
    rating: 4.6,
    brand: 'IKEA',
    weight: 45000,
    createTime: '2024-01-08 10:00:00',
    updateTime: '2024-01-08 10:00:00'
  },
  {
    id: 9,
    name: '金士顿U盘',
    description: '高速USB3.0 U盘，容量32GB',
    categoryId: 1, // 电子产品分类
    price: 89,
    originalPrice: 99,
    stock: 120,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=USB+Drive'],
    sales: 95,
    rating: 4.4,
    brand: '金士顿',
    weight: 15,
    createTime: '2024-01-09 10:00:00',
    updateTime: '2024-01-09 10:00:00'
  },
  {
    id: 10,
    name: '乐高积木',
    description: '创意建筑积木套装，适合儿童',
    categoryId: 24, // 玩具分类
    price: 399,
    originalPrice: 449,
    stock: 60,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Lego+Blocks'],
    sales: 45,
    rating: 4.8,
    brand: 'LEGO',
    weight: 800,
    createTime: '2024-01-10 10:00:00',
    updateTime: '2024-01-10 10:00:00'
  },
  {
    id: 11,
    name: '华为Mate 50',
    description: '华为旗舰手机，XMAGE影像',
    categoryId: 2, // 手机分类
    price: 4999,
    originalPrice: 5499,
    stock: 30,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Huawei+Mate+50'],
    sales: 75,
    rating: 4.5,
    brand: '华为',
    weight: 205,
    createTime: '2024-01-11 10:00:00',
    updateTime: '2024-01-11 10:00:00'
  },
  {
    id: 12,
    name: '戴尔笔记本',
    description: '商务办公笔记本，Intel i7处理器',
    categoryId: 3, // 电脑分类
    price: 6999,
    originalPrice: 7999,
    stock: 25,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Dell+Laptop'],
    sales: 28,
    rating: 4.3,
    brand: 'Dell',
    weight: 1800,
    createTime: '2024-01-12 10:00:00',
    updateTime: '2024-01-12 10:00:00'
  },
  {
    id: 13,
    name: '李宁运动裤',
    description: '专业运动裤，速干透气',
    categoryId: 5, // 男装分类
    price: 299,
    originalPrice: 349,
    stock: 90,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Li+Ning+Pants'],
    sales: 55,
    rating: 4.4,
    brand: '李宁',
    weight: 280,
    createTime: '2024-01-13 10:00:00',
    updateTime: '2024-01-13 10:00:00'
  },
  {
    id: 14,
    name: '香奈儿香水',
    description: '经典女士香水，优雅持久',
    categoryId: 21, // 化妆分类
    price: 899,
    originalPrice: 999,
    stock: 40,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Chanel+Perfume'],
    sales: 22,
    rating: 4.7,
    brand: 'Chanel',
    weight: 150,
    createTime: '2024-01-14 10:00:00',
    updateTime: '2024-01-14 10:00:00'
  },
  {
    id: 15,
    name: '婴儿奶粉',
    description: '有机婴儿奶粉，营养均衡',
    categoryId: 23, // 奶粉分类
    price: 299,
    originalPrice: 329,
    stock: 70,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Baby+Formula'],
    sales: 38,
    rating: 4.6,
    brand: '美赞臣',
    weight: 800,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 16,
    name: '足球',
    description: '专业比赛用球，FIFA认证',
    categoryId: 17, // 球类分类
    price: 199,
    originalPrice: 229,
    stock: 45,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Football'],
    sales: 30,
    rating: 4.5,
    brand: 'Adidas',
    weight: 410,
    createTime: '2024-01-16 10:00:00',
    updateTime: '2024-01-16 10:00:00'
  },
  {
    id: 17,
    name: '汽车轮胎',
    description: '轿车专用轮胎，耐磨防滑',
    categoryId: 26, // 配件分类
    price: 599,
    originalPrice: 699,
    stock: 35,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Car+Tire'],
    sales: 18,
    rating: 4.4,
    brand: '米其林',
    weight: 9500,
    createTime: '2024-01-17 10:00:00',
    updateTime: '2024-01-17 10:00:00'
  },
  {
    id: 18,
    name: '狗粮',
    description: '全价犬粮，适合成犬',
    categoryId: 29, // 宠物食品分类
    price: 89,
    originalPrice: 99,
    stock: 85,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Dog+Food'],
    sales: 62,
    rating: 4.5,
    brand: '皇家',
    weight: 12000,
    createTime: '2024-01-18 10:00:00',
    updateTime: '2024-01-18 10:00:00'
  },
  {
    id: 19,
    name: '扫地机器人',
    description: '智能扫地机器人，自动充电',
    categoryId: 10, // 家居分类
    price: 1999,
    originalPrice: 2299,
    stock: 22,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=Robot+Vacuum'],
    sales: 15,
    rating: 4.6,
    brand: '小米',
    weight: 3500,
    createTime: '2024-01-19 10:00:00',
    updateTime: '2024-01-19 10:00:00'
  },
  {
    id: 20,
    name: 'JavaScript高级程序设计',
    description: '经典前端开发书籍，系统全面',
    categoryId: 14, // 小说分类（这里应该改成技术书籍分类，但为了演示用小说）
    price: 89,
    originalPrice: 99,
    stock: 55,
    status: 1,
    images: ['https://via.placeholder.com/300x300?text=JavaScript+Book'],
    sales: 40,
    rating: 4.8,
    brand: '人民邮电出版社',
    weight: 650,
    createTime: '2024-01-20 10:00:00',
    updateTime: '2024-01-20 10:00:00'
  }
]

export default [
  // 获取商品列表
  {
    url: '/api/products',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page) || 1
      const size = parseInt(query.size) || 10
      const start = (page - 1) * size
      const end = start + size
      let filteredList = products
      let totalRecords = products.length

      // 搜索过滤
      if (query.keyword) {
        filteredList = products.filter(product =>
          product.name.includes(query.keyword) ||
          product.description.includes(query.keyword) ||
          product.brand.includes(query.keyword)
        )
        totalRecords = filteredList.length
      }

      // 分类过滤
      if (query.categoryId) {
        filteredList = filteredList.filter(product => product.categoryId == query.categoryId)
        totalRecords = filteredList.length
      }

      // 状态过滤
      if (query.status !== undefined && query.status !== '') {
        filteredList = filteredList.filter(product => product.status == query.status)
        totalRecords = filteredList.length
      }

      // 价格范围过滤
      if (query.minPrice !== undefined && query.minPrice !== '') {
        filteredList = filteredList.filter(product => product.price >= parseFloat(query.minPrice))
        totalRecords = filteredList.length
      }
      if (query.maxPrice !== undefined && query.maxPrice !== '') {
        filteredList = filteredList.filter(product => product.price <= parseFloat(query.maxPrice))
        totalRecords = filteredList.length
      }

      // 库存范围过滤
      if (query.minStock !== undefined && query.minStock !== '') {
        filteredList = filteredList.filter(product => product.stock >= parseInt(query.minStock))
        totalRecords = filteredList.length
      }
      if (query.maxStock !== undefined && query.maxStock !== '') {
        filteredList = filteredList.filter(product => product.stock <= parseInt(query.maxStock))
        totalRecords = filteredList.length
      }

      // 排序
      if (query.sortBy && query.sortOrder) {
        filteredList.sort((a, b) => {
          let aValue = a[query.sortBy]
          let bValue = b[query.sortBy]

          // 处理时间字段
          if (query.sortBy === 'createTime' || query.sortBy === 'updateTime') {
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

  // 添加商品
  {
    url: '/api/products',
    method: 'post',
    response: ({ body }) => {
      const newProduct = {
        id: products.length + 1,
        ...body,
        createTime: body.createTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      products.push(newProduct)
      return {
        code: 0,
        message: '添加成功',
        data: newProduct
      }
    }
  },

  // 删除商品
  {
    url: '/api/products/:id',
    method: 'delete',
    response: ({ url }) => {
      const id = url.split('/').pop()
      const index = products.findIndex(product => product.id == id)
      if (index > -1) {
        products.splice(index, 1)
        return {
          code: 0,
          message: '删除成功'
        }
      } else {
        return {
          code: 1,
          message: '商品不存在'
        }
      }
    }
  },

  // 编辑商品
  {
    url: '/api/products/:id',
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.split('/').pop())
      const product = products.find(product => product.id === id)
      if (product) {
        Object.assign(product, body)
        product.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        return {
          code: 0,
          message: '编辑成功'
        }
      } else {
        return {
          code: 1,
          message: '商品不存在'
        }
      }
    }
  },

  // 批量删除商品
  {
    url: '/api/products/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let deletedCount = 0
      ids.forEach(id => {
        const index = products.findIndex(product => product.id === id)
        if (index > -1) {
          products.splice(index, 1)
          deletedCount++
        }
      })
      return {
        code: 0,
        message: `成功删除 ${deletedCount} 个商品`,
        data: { deletedCount }
      }
    }
  },

  // 获取商品统计
  {
    url: '/api/products/stats',
    method: 'get',
    response: () => {
      const total = products.length
      const active = products.filter(p => p.status === 1).length
      const inactive = products.filter(p => p.status === 0).length
      const lowStock = products.filter(p => p.stock <= 10).length
      const totalSales = products.reduce((sum, p) => sum + p.sales, 0)
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

      return {
        code: 0,
        data: {
          total,
          active,
          inactive,
          lowStock,
          totalSales,
          totalValue
        }
      }
    }
  },

  // 切换商品状态
  {
    url: '/api/products/:id/toggle-status',
    method: 'put',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop())
      const product = products.find(p => p.id === id)
      if (product) {
        product.status = product.status === 1 ? 0 : 1
        product.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        return {
          code: 0,
          message: '状态切换成功',
          data: { status: product.status }
        }
      } else {
        return {
          code: 1,
          message: '商品不存在'
        }
      }
    }
  },

  // 批量启用商品
  {
    url: '/api/products/batch-enable',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let enabledCount = 0
      ids.forEach(id => {
        const product = products.find(p => p.id === id)
        if (product && product.status === 0) {
          product.status = 1
          product.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
          enabledCount++
        }
      })
      return {
        code: 0,
        message: `成功启用 ${enabledCount} 个商品`,
        data: { enabledCount }
      }
    }
  },

  // 批量禁用商品
  {
    url: '/api/products/batch-disable',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      let disabledCount = 0
      ids.forEach(id => {
        const product = products.find(p => p.id === id)
        if (product && product.status === 1) {
          product.status = 0
          product.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
          disabledCount++
        }
      })
      return {
        code: 0,
        message: `成功禁用 ${disabledCount} 个商品`,
        data: { disabledCount }
      }
    }
  },

  // 更新商品库存
  {
    url: '/api/products/:id/stock',
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.split('/').pop())
      const product = products.find(p => p.id === id)
      if (product) {
        product.stock = parseInt(body.stock)
        product.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        return {
          code: 0,
          message: '库存更新成功',
          data: { stock: product.stock }
        }
      } else {
        return {
          code: 1,
          message: '商品不存在'
        }
      }
    }
  },

  // 批量更新商品库存
  {
    url: '/api/products/batch-stock',
    method: 'post',
    response: ({ body }) => {
      const { updates } = body
      let updatedCount = 0
      updates.forEach(update => {
        const product = products.find(p => p.id === update.id)
        if (product) {
          product.stock = parseInt(update.stock)
          product.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
          updatedCount++
        }
      })
      return {
        code: 0,
        message: `成功更新 ${updatedCount} 个商品库存`,
        data: { updatedCount }
      }
    }
  },

  // 导出商品数据
  {
    url: '/api/products/export',
    method: 'get',
    response: ({ query }) => {
      let exportData = products

      // 应用过滤条件
      if (query.keyword) {
        exportData = products.filter(product =>
          product.name.includes(query.keyword) ||
          product.description.includes(query.keyword) ||
          product.brand.includes(query.keyword)
        )
      }
      if (query.categoryId) {
        exportData = exportData.filter(product => product.categoryId == query.categoryId)
      }
      if (query.status !== undefined && query.status !== '') {
        exportData = exportData.filter(product => product.status == query.status)
      }

      return {
        code: 0,
        data: exportData,
        message: `导出 ${exportData.length} 条商品数据`
      }
    }
  }
]
