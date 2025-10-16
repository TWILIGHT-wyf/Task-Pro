import Mock from 'mockjs'

const Random = Mock.Random

// 生成评论数据
const generateReviews = (count = 50) => {
  const reviews = []
  const statuses = ['pending', 'approved', 'rejected']
  const productNames = ['iPhone 15 Pro', 'MacBook Pro', 'AirPods Pro', 'iPad Air', 'Apple Watch', '索尼耳机', '小米手机', '华为平板']

  for (let i = 1; i <= count; i++) {
    reviews.push({
      id: i,
      productId: Random.integer(1, 20),
      productName: Random.pick(productNames),
      customerId: Random.integer(1, 100),
      customerName: Random.cname(),
      customerAvatar: Random.image('50x50', Random.color(), '#FFF', Random.first()),
      rating: Random.integer(1, 5),
      content: Random.cparagraph(2, 5),
      images: Random.boolean() ? Array.from({ length: Random.integer(1, 4) }, () => Random.image('200x200', Random.color(), '#FFF', 'Review')) : [],
      status: Random.pick(statuses),
      helpful: Random.integer(0, 200),
      reply: Random.boolean() ? {
        content: Random.cparagraph(1, 2),
        time: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        replier: '管理员'
      } : null,
      createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }

  return reviews
}

let reviews = generateReviews(50)

export default [
  // 获取评论列表
  {
    url: '/api/reviews',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search, status, rating, sortBy, sortOrder } = query

      let filteredReviews = [...reviews]

      // 搜索过滤
      if (search) {
        filteredReviews = filteredReviews.filter(review =>
          review.productName.toLowerCase().includes(search.toLowerCase()) ||
          review.customerName.toLowerCase().includes(search.toLowerCase()) ||
          review.content.toLowerCase().includes(search.toLowerCase())
        )
      }

      // 状态过滤
      if (status && status !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.status === status)
      }

      // 评分过滤
      if (rating) {
        filteredReviews = filteredReviews.filter(review => review.rating === Number(rating))
      }

      // 排序
      if (sortBy) {
        filteredReviews.sort((a, b) => {
          const order = sortOrder === 'desc' ? -1 : 1
          if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
            return order * (new Date(a[sortBy]) - new Date(b[sortBy]))
          }
          return order * (a[sortBy] - b[sortBy])
        })
      }

      const start = (page - 1) * pageSize
      const end = start + Number(pageSize)
      const paginatedReviews = filteredReviews.slice(start, end)

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: paginatedReviews,
          total: filteredReviews.length,
          page: Number(page),
          pageSize: Number(pageSize)
        }
      }
    }
  },

  // 获取单个评论详情
  {
    url: /\/api\/reviews\/(\d+)/,
    method: 'get',
    response: ({ url }) => {
      const id = Number(url.match(/\/api\/reviews\/(\d+)/)[1])
      const review = reviews.find(r => r.id === id)

      if (review) {
        return {
          code: 200,
          message: '获取成功',
          data: review
        }
      }

      return {
        code: 404,
        message: '评论不存在',
        data: null
      }
    }
  },

  // 创建评论
  {
    url: '/api/reviews',
    method: 'post',
    response: ({ body }) => {
      const newReview = {
        id: reviews.length + 1,
        ...body,
        helpful: 0,
        reply: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      reviews.unshift(newReview)

      return {
        code: 200,
        message: '创建成功',
        data: newReview
      }
    }
  },

  // 更新评论
  {
    url: /\/api\/reviews\/(\d+)/,
    method: 'put',
    response: ({ url, body }) => {
      const id = Number(url.match(/\/api\/reviews\/(\d+)/)[1])
      const index = reviews.findIndex(r => r.id === id)

      if (index !== -1) {
        reviews[index] = {
          ...reviews[index],
          ...body,
          updatedAt: new Date().toISOString()
        }

        return {
          code: 200,
          message: '更新成功',
          data: reviews[index]
        }
      }

      return {
        code: 404,
        message: '评论不存在',
        data: null
      }
    }
  },

  // 删除评论
  {
    url: /\/api\/reviews\/(\d+)/,
    method: 'delete',
    response: ({ url }) => {
      const id = Number(url.match(/\/api\/reviews\/(\d+)/)[1])
      const index = reviews.findIndex(r => r.id === id)

      if (index !== -1) {
        reviews.splice(index, 1)

        return {
          code: 200,
          message: '删除成功',
          data: null
        }
      }

      return {
        code: 404,
        message: '评论不存在',
        data: null
      }
    }
  },

  // 批量删除
  {
    url: '/api/reviews/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body
      reviews = reviews.filter(review => !ids.includes(review.id))

      return {
        code: 200,
        message: `成功删除 ${ids.length} 条评论`,
        data: null
      }
    }
  },

  // 批量更新状态
  {
    url: '/api/reviews/batch-status',
    method: 'post',
    response: ({ body }) => {
      const { ids, status } = body

      reviews = reviews.map(review => {
        if (ids.includes(review.id)) {
          return {
            ...review,
            status,
            updatedAt: new Date().toISOString()
          }
        }
        return review
      })

      return {
        code: 200,
        message: `成功更新 ${ids.length} 条评论状态`,
        data: null
      }
    }
  },

  // 审核评论
  {
    url: /\/api\/reviews\/(\d+)\/audit/,
    method: 'post',
    response: ({ url, body }) => {
      const id = Number(url.match(/\/api\/reviews\/(\d+)/)[1])
      const { status } = body
      const index = reviews.findIndex(r => r.id === id)

      if (index !== -1) {
        reviews[index] = {
          ...reviews[index],
          status,
          updatedAt: new Date().toISOString()
        }

        return {
          code: 200,
          message: '审核成功',
          data: reviews[index]
        }
      }

      return {
        code: 404,
        message: '评论不存在',
        data: null
      }
    }
  },

  // 批量审核
  {
    url: '/api/reviews/batch-audit',
    method: 'post',
    response: ({ body }) => {
      const { ids, status } = body

      reviews = reviews.map(review => {
        if (ids.includes(review.id)) {
          return {
            ...review,
            status,
            updatedAt: new Date().toISOString()
          }
        }
        return review
      })

      return {
        code: 200,
        message: `成功审核 ${ids.length} 条评论`,
        data: null
      }
    }
  },

  // 导出评论
  {
    url: '/api/reviews/export',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '导出成功',
        data: reviews
      }
    }
  },

  // 导入评论
  {
    url: '/api/reviews/import',
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
