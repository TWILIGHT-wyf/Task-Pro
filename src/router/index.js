import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import BasicLayout from '@/layout/BasicLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页和注册页 - 不使用布局
    {
      path: '/login',
      name: 'login',
      component: () => import('@/view/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/view/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    // 需要权限的页面 - 使用 BasicLayout
    {
      path: '/',
      component: BasicLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/view/DashboardView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('@/view/CategoriesView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/products',
          name: 'products',
          component: () => import('@/view/ProductsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/guest',
          name: 'guest',
          component: () => import('@/view/CustomersView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/view/OrdersView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/inventory',
          name: 'inventory',
          component: () => import('@/view/InventoryView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/promotions',
          name: 'promotions',
          component: () => import('@/view/PromotionsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/reviews',
          name: 'reviews',
          component: () => import('@/view/ReviewsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/shipping',
          name: 'shipping',
          component: () => import('@/view/ShippingView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/analytics',
          name: 'analytics',
          component: () => import('@/view/AnalyticsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/system',
          name: 'system',
          component: () => import('@/view/SystemView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  // 如果目标路由需要认证
  if (to.meta.requiresAuth) {
    if (!token) {
      // 没有 token，跳转到登录页
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      // 有 token，检查是否有用户信息
      if (!userStore.userInfo) {
        try {
          // 页面刷新后 userInfo 为空，尝试获取用户信息
          await userStore.getUserInfo()
          next()
        } catch (error) {
          // 获取用户信息失败(可能token过期)，执行登出并跳转登录
          console.error('获取用户信息失败，请重新登录')
          userStore.logout()
          next({ path: '/login', query: { redirect: to.fullPath } })
        }
      } else {
        // 已有用户信息，直接放行
        next()
      }
    }
  } else {
    // 不需要认证的路由
    if (token && (to.path === '/login' || to.path === '/register')) {
      // 已登录用户访问登录页或注册页，重定向到首页
      next({ path: '/' })
    } else {
      next()
    }
  }
})

export default router
