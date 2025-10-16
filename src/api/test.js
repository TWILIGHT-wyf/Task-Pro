// API测试脚本
// 用于验证所有API封装是否正确

import {
  // 分类API
  getCategories, getCategoryStats,

  // 会员API
  getCustomers, getCustomerStats,

  // 库存API
  getInventory, getInventoryStats,

  // 订单API
  getOrders, getOrderStats,

  // 商品API
  getProducts, getProductStats,

  // 促销API
  getPromotions, getPromotionStats,

  // 用户API
  login, getUserInfo
} from './index.js'

// 测试函数
export const testAPIs = async () => {
  console.log('开始API测试...')

  try {
    // 测试分类API
    console.log('测试分类API...')
    await getCategories({ page: 1, size: 5 })
    console.log('✓ getCategories 成功')

    await getCategoryStats()
    console.log('✓ getCategoryStats 成功')

    // 测试会员API
    console.log('测试会员API...')
    await getCustomers({ page: 1, size: 5 })
    console.log('✓ getCustomers 成功')

    await getCustomerStats()
    console.log('✓ getCustomerStats 成功')

    // 测试库存API
    console.log('测试库存API...')
    await getInventory({ page: 1, size: 5 })
    console.log('✓ getInventory 成功')

    await getInventoryStats()
    console.log('✓ getInventoryStats 成功')

    // 测试订单API
    console.log('测试订单API...')
    await getOrders({ page: 1, size: 5 })
    console.log('✓ getOrders 成功')

    await getOrderStats()
    console.log('✓ getOrderStats 成功')

    // 测试商品API
    console.log('测试商品API...')
    await getProducts({ page: 1, size: 5 })
    console.log('✓ getProducts 成功')

    await getProductStats()
    console.log('✓ getProductStats 成功')

    // 测试促销API
    console.log('测试促销API...')
    await getPromotions({ page: 1, size: 5 })
    console.log('✓ getPromotions 成功')

    await getPromotionStats()
    console.log('✓ getPromotionStats 成功')

    // 测试用户API（需要登录）
    console.log('测试用户API...')
    try {
      await login({ username: 'demo', password: 'demo' })
      console.log('✓ login 成功')

      await getUserInfo()
      console.log('✓ getUserInfo 成功')
    } catch (error) {
      console.log('⚠ 用户API测试跳过（可能需要正确凭据）')
    }

    console.log('所有API测试完成！')

  } catch (error) {
    console.error('API测试失败:', error)
    throw error
  }
}

// 如果直接运行此文件，则执行测试
if (typeof window === 'undefined') {
  // Node.js环境
  testAPIs().catch(console.error)
}
