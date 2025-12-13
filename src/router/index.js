import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import BasicLayout from '@/layout/BasicLayout.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const hasPermission = (userRoles, routeRoles) => {
  if (!routeRoles || routeRoles.length === 0) return true
  if (!Array.isArray(userRoles) || userRoles.length === 0) return false
  return routeRoles.some(role => userRoles.includes(role))
}

const normalizeRoles = (userInfo) => {
  const raw = userInfo?.roles ?? userInfo?.role
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return [raw]
}

const filterAsyncRoutes = (routes, userRoles) => {
  const res = []
  for (const route of routes) {
    const routeRoles = route.meta?.roles
    if (!hasPermission(userRoles, routeRoles)) continue

    const r = { ...route }
    if (r.children && r.children.length > 0) {
      r.children = filterAsyncRoutes(r.children, userRoles)
    }
    res.push(r)
  }
  return res
}

// 常量路由：不依赖权限，始终存在
const constantRoutes = [
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
  // 需要权限的页面使用 BasicLayout
  {
    path: '/',
    name: 'root',
    component: BasicLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/view/DashboardView.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/view/ForbiddenView.vue'),
    meta: { requiresAuth: false }
  },
  // 兜底：未匹配路由重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

//动态路由（业务路由）：按权限注入。
const asyncRoutes = [
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
    meta: { requiresAuth: true, roles: ['admin', 'analyst'] }
  },
  {
    path: '/system',
    name: 'system',
    component: () => import('@/view/SystemView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  }
]

const dynamicRouteNames = asyncRoutes.map(r => r.name).filter(Boolean)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

let isAsyncRoutesAdded = false

const resetDynamicRoutes = () => {
  for (const name of dynamicRouteNames) {
    if (router.hasRoute(name)) router.removeRoute(name)
  }
  isAsyncRoutesAdded = false
}

const addRoutesOnce = (routes) => {
  // 只往 root(layout) 下挂业务路由
  for (const route of routes) {
    if (route.name && router.hasRoute(route.name)) continue
    router.addRoute('root', route)
  }
}

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 体验优化：路由切换开始就展示进度条，避免“白屏焦虑”
  NProgress.start()

  const userStore = useUserStore()
  const token = userStore.token

  // 未登录：只允许去 login/register，其他一律打回登录
  if (!token) {
    resetDynamicRoutes()
    if (to.path === '/login' || to.path === '/register') {
      return next()
    }
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 已登录用户访问 login/register：重定向首页
  if (to.path === '/login' || to.path === '/register') {
    return next({ path: '/', replace: true })
  }

  // 有 token：确保已拉取用户信息（用于 roles 鉴权）
  if (!userStore.userInfo) {
    try {
      await userStore.getUserInfo()
    } catch {
      // Token 失效 / 拉取失败：清理登录态并回到登录页
      console.error('获取用户信息失败，请重新登录')
      resetDynamicRoutes()
      userStore.logout()
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }

  const userRoles = normalizeRoles(userStore.userInfo)

  // 动态注入业务路由
  if (!isAsyncRoutesAdded) {
    const accessibleRoutes = filterAsyncRoutes(asyncRoutes, userRoles)
    addRoutesOnce(accessibleRoutes)
    isAsyncRoutesAdded = true

    return next({ path: to.fullPath, replace: true })
  }

  const routeRoles = to.matched
    .map(r => r.meta?.roles)
    .filter(Boolean)
    .flat()

  if (routeRoles.length > 0 && !hasPermission(userRoles, routeRoles)) {
    return next({ path: '/403', replace: true })
  }

  return next()
})

router.afterEach(() => {
  // 路由切换完成，收起进度条
  NProgress.done()
})

router.onError(() => {
  // 异常中断也要 done，否则进度条会卡住
  NProgress.done()
})

export default router
