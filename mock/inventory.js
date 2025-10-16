// 模拟库存数据
let inventory = [
  {
    id: 1,
    productName: 'iPhone 15 Pro',
    sku: 'IPH15P-128-BLK',
    category: 'electronics',
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    unitCost: 8999.00,
    totalValue: 404955.00,
    status: 'normal',
    supplier: 'Apple Inc.',
    lastUpdated: '2024-01-15 14:30:25',
    location: 'A-01-05'
  },
  {
    id: 2,
    productName: 'MacBook Air M3',
    sku: 'MBA-M3-13-SLV',
    category: 'electronics',
    currentStock: 8,
    minStock: 5,
    maxStock: 50,
    unitCost: 9999.00,
    totalValue: 79992.00,
    status: 'low',
    supplier: 'Apple Inc.',
    lastUpdated: '2024-01-14 09:15:30',
    location: 'A-02-03'
  },
  {
    id: 3,
    productName: 'Nike Air Max 270',
    sku: 'NAM270-BLK-42',
    category: 'clothing',
    currentStock: 120,
    minStock: 20,
    maxStock: 200,
    unitCost: 899.00,
    totalValue: 107880.00,
    status: 'normal',
    supplier: 'Nike China',
    lastUpdated: '2024-01-13 16:45:12',
    location: 'B-01-08'
  },
  {
    id: 4,
    productName: 'Kindle Paperwhite',
    sku: 'KPW-11TH-8GB',
    category: 'electronics',
    currentStock: 0,
    minStock: 15,
    maxStock: 80,
    unitCost: 999.00,
    totalValue: 0.00,
    status: 'out',
    supplier: 'Amazon',
    lastUpdated: '2024-01-12 11:20:45',
    location: 'A-03-12'
  },
  {
    id: 5,
    productName: '星巴克咖啡豆',
    sku: 'SBC-BRAZIL-500G',
    category: 'food',
    currentStock: 25,
    minStock: 30,
    maxStock: 150,
    unitCost: 128.00,
    totalValue: 3200.00,
    status: 'low',
    supplier: '星巴克',
    lastUpdated: '2024-01-11 08:30:15',
    location: 'C-01-02'
  },
  {
    id: 6,
    productName: '华为Mate 50 Pro',
    sku: 'HM50P-256-BLK',
    category: 'electronics',
    currentStock: 67,
    minStock: 20,
    maxStock: 120,
    unitCost: 6999.00,
    totalValue: 468933.00,
    status: 'normal',
    supplier: '华为科技',
    lastUpdated: '2024-01-10 13:45:22',
    location: 'A-01-07'
  },
  {
    id: 7,
    productName: 'Adidas Ultraboost 22',
    sku: 'AUB22-WHT-43',
    category: 'clothing',
    currentStock: 180,
    minStock: 25,
    maxStock: 300,
    unitCost: 1299.00,
    totalValue: 233820.00,
    status: 'excess',
    supplier: 'Adidas',
    lastUpdated: '2024-01-09 15:20:33',
    location: 'B-02-05'
  },
  {
    id: 8,
    productName: 'Python编程入门',
    sku: 'PY-BOOK-2023',
    category: 'books',
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    unitCost: 59.00,
    totalValue: 2655.00,
    status: 'normal',
    supplier: '机械工业出版社',
    lastUpdated: '2024-01-08 10:15:40',
    location: 'D-01-03'
  },
  {
    id: 9,
    productName: 'Sony WH-1000XM5',
    sku: 'SWH1000XM5-BLK',
    category: 'electronics',
    currentStock: 12,
    minStock: 8,
    maxStock: 60,
    unitCost: 2999.00,
    totalValue: 35988.00,
    status: 'normal',
    supplier: 'Sony China',
    lastUpdated: '2024-01-07 14:50:18',
    location: 'A-02-09'
  },
  {
    id: 10,
    productName: '联想小新Pro 14',
    sku: 'LXNP14-I7-16G',
    category: 'electronics',
    currentStock: 3,
    minStock: 5,
    maxStock: 40,
    unitCost: 5999.00,
    totalValue: 17997.00,
    status: 'low',
    supplier: '联想集团',
    lastUpdated: '2024-01-06 09:25:55',
    location: 'A-03-01'
  },
  {
    id: 11,
    productName: 'H&M棉质T恤',
    sku: 'HM-TSHIRT-WHT-M',
    category: 'clothing',
    currentStock: 95,
    minStock: 30,
    maxStock: 200,
    unitCost: 99.00,
    totalValue: 9405.00,
    status: 'normal',
    supplier: 'H&M',
    lastUpdated: '2024-01-05 16:40:12',
    location: 'B-01-11'
  },
  {
    id: 12,
    productName: '蒙牛纯牛奶',
    sku: 'MN-MILK-1L',
    category: 'food',
    currentStock: 156,
    minStock: 50,
    maxStock: 300,
    unitCost: 3.50,
    totalValue: 546.00,
    status: 'normal',
    supplier: '蒙牛乳业',
    lastUpdated: '2024-01-04 11:35:28',
    location: 'C-02-04'
  }
]

// 库存状态映射
export const inventoryStatusMap = {
  normal: { text: '正常', color: '#10b981' },
  low: { text: '低库存', color: '#f59e0b' },
  out: { text: '缺货', color: '#ef4444' },
  excess: { text: '库存过多', color: '#8b5cf6' }
}

// 商品分类映射
export const categoryMap = {
  electronics: '电子产品',
  clothing: '服装',
  food: '食品',
  books: '图书'
}

// 更新库存状态
const updateStockStatus = (item) => {
  if (item.currentStock <= 0) {
    item.status = 'out'
  } else if (item.currentStock <= item.minStock) {
    item.status = 'low'
  } else if (item.currentStock > item.maxStock) {
    item.status = 'excess'
  } else {
    item.status = 'normal'
  }
}

export default [
  // 获取库存列表
  {
    url: '/api/inventory',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page) || 1
      const size = parseInt(query.size) || 10
      const start = (page - 1) * size
      const end = start + size
      let filteredList = [...inventory]
      let totalRecords = inventory.length

      // 搜索过滤
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.productName.toLowerCase().includes(keyword) ||
          item.sku.toLowerCase().includes(keyword) ||
          item.supplier?.toLowerCase().includes(keyword)
        )
        totalRecords = filteredList.length
      }

      // 分类过滤
      if (query.category) {
        filteredList = filteredList.filter(item => item.category === query.category)
        totalRecords = filteredList.length
      }

      // 状态过滤
      if (query.status) {
        filteredList = filteredList.filter(item => item.status === query.status)
        totalRecords = filteredList.length
      }

      // 排序
      if (query.sortBy) {
        filteredList.sort((a, b) => {
          const aVal = a[query.sortBy]
          const bVal = b[query.sortBy]

          if (query.sortOrder === 'DESC') {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
          } else {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
          }
        })
      }

      // 分页
      const paginatedList = filteredList.slice(start, end)

      return {
        code: 0,
        data: {
          list: paginatedList,
          totalRecords: totalRecords,
          totalPages: Math.ceil(totalRecords / size),
          currentPage: page
        }
      }
    }
  },

  // 获取单个库存记录
  {
    url: '/api/inventory/:id',
    method: 'get',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop())
      const item = inventory.find(inv => inv.id === id)

      if (item) {
        return {
          code: 0,
          data: item
        }
      } else {
        return {
          code: 1,
          message: '库存记录不存在'
        }
      }
    }
  },

  // 添加库存记录
  {
    url: '/api/inventory',
    method: 'post',
    response: ({ body }) => {
      const newItem = {
        id: inventory.length + 1,
        ...body,
        lastUpdated: new Date().toLocaleString('zh-CN'),
        totalValue: body.currentStock * body.unitCost
      }

      // 设置初始状态
      updateStockStatus(newItem)

      inventory.push(newItem)

      return {
        code: 0,
        message: '添加成功',
        data: newItem
      }
    }
  },

  // 更新库存记录
  {
    url: '/api/inventory/:id',
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.split('/').pop())
      const item = inventory.find(inv => inv.id === id)

      if (item) {
        Object.assign(item, body)
        item.lastUpdated = new Date().toLocaleString('zh-CN')
        item.totalValue = item.currentStock * item.unitCost

        // 更新状态
        updateStockStatus(item)

        return {
          code: 0,
          message: '更新成功',
          data: item
        }
      } else {
        return {
          code: 1,
          message: '库存记录不存在'
        }
      }
    }
  },

  // 删除库存记录
  {
    url: '/api/inventory/:id',
    method: 'delete',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop())
      const index = inventory.findIndex(inv => inv.id === id)

      if (index > -1) {
        inventory.splice(index, 1)
        return {
          code: 0,
          message: '删除成功'
        }
      } else {
        return {
          code: 1,
          message: '库存记录不存在'
        }
      }
    }
  },

  // 批量删除库存记录
  {
    url: '/api/inventory/batch',
    method: 'delete',
    response: ({ body }) => {
      const { ids } = body
      let deletedCount = 0

      ids.forEach(id => {
        const index = inventory.findIndex(inv => inv.id === id)
        if (index > -1) {
          inventory.splice(index, 1)
          deletedCount++
        }
      })

      return {
        code: 0,
        message: `成功删除 ${deletedCount} 条记录`,
        data: { deletedCount }
      }
    }
  },

  // 商品入库
  {
    url: '/api/inventory/stock-in',
    method: 'post',
    response: ({ body }) => {
      const { productId, quantity, unitCost, supplier } = body
      const item = inventory.find(inv => inv.id === productId)

      if (item) {
        item.currentStock += quantity
        item.unitCost = unitCost || item.unitCost
        item.supplier = supplier || item.supplier
        item.lastUpdated = new Date().toLocaleString('zh-CN')
        item.totalValue = item.currentStock * item.unitCost

        // 更新状态
        updateStockStatus(item)

        return {
          code: 0,
          message: '入库成功',
          data: item
        }
      } else {
        return {
          code: 1,
          message: '商品不存在'
        }
      }
    }
  },

  // 商品出库
  {
    url: '/api/inventory/stock-out',
    method: 'post',
    response: ({ body }) => {
      const { productId, quantity } = body
      const item = inventory.find(inv => inv.id === productId)

      if (item) {
        if (item.currentStock < quantity) {
          return {
            code: 1,
            message: '库存不足'
          }
        }

        item.currentStock -= quantity
        item.lastUpdated = new Date().toLocaleString('zh-CN')
        item.totalValue = item.currentStock * item.unitCost

        // 更新状态
        updateStockStatus(item)

        return {
          code: 0,
          message: '出库成功',
          data: item
        }
      } else {
        return {
          code: 1,
          message: '商品不存在'
        }
      }
    }
  },

  // 库存调整
  {
    url: '/api/inventory/adjust',
    method: 'post',
    response: ({ body }) => {
      const { productId, newStock } = body
      const item = inventory.find(inv => inv.id === productId)

      if (item) {
        item.currentStock = newStock
        item.lastUpdated = new Date().toLocaleString('zh-CN')
        item.totalValue = item.currentStock * item.unitCost

        // 更新状态
        updateStockStatus(item)

        return {
          code: 0,
          message: '库存调整成功',
          data: item
        }
      } else {
        return {
          code: 1,
          message: '商品不存在'
        }
      }
    }
  },

  // 批量库存调整
  {
    url: '/api/inventory/batch-adjust',
    method: 'post',
    response: ({ body }) => {
      const adjustments = body
      let successCount = 0
      let failedItems = []

      adjustments.forEach(adjustment => {
        const { productId, newStock } = adjustment
        const item = inventory.find(inv => inv.id === productId)

        if (item) {
          item.currentStock = newStock
          item.lastUpdated = new Date().toLocaleString('zh-CN')
          item.totalValue = item.currentStock * item.unitCost

          // 更新状态
          updateStockStatus(item)
          successCount++
        } else {
          failedItems.push(productId)
        }
      })

      if (failedItems.length > 0) {
        return {
          code: 1,
          message: `部分调整失败，成功调整 ${successCount} 条记录，失败商品ID: ${failedItems.join(', ')}`,
          data: { successCount, failedItems }
        }
      } else {
        return {
          code: 0,
          message: `批量调整成功，共调整 ${successCount} 条记录`,
          data: { successCount }
        }
      }
    }
  },

  // 获取库存统计
  {
    url: '/api/inventory/stats',
    method: 'get',
    response: () => {
      const totalProducts = inventory.length
      const lowStockCount = inventory.filter(item => item.status === 'low').length
      const totalStock = inventory.reduce((sum, item) => sum + item.currentStock, 0)
      const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)

      return {
        code: 0,
        data: {
          totalProducts,
          lowStockCount,
          totalStock,
          totalValue
        }
      }
    }
  }
]
