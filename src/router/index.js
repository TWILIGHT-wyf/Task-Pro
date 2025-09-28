import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('@/view/DashboardView.vue') },
    { path: '/products', name: 'products', component: () => import('@/view/ProductsView.vue') },
    { path: '/login', name: 'login', component: () => import('@/view/LoginView.vue') },
    { path: '/category', name: 'category', component: () => import('@/view/CategoriesView.vue') },
    { path: '/guest', name: 'guest', component: () => import('@/view/CustomersView.vue') },
    { path: '/order', name: 'order', component: () => import('@/view/OrdersView.vue') },
    { path: '/inventory', name: 'inventory', component: () => import('@/view/InventoryView.vue') },
    { path: '/promotions', name: 'promotions', component: () => import('@/view/PromotionsView.vue') },
    { path: '/reviews', name: 'reviews', component: () => import('@/view/ReviewsView.vue') },
    { path: '/shipping', name: 'shipping', component: () => import('@/view/ShippingView.vue') },
    { path: '/analytics', name: 'analytics', component: () => import('@/view/AnalyticsView.vue') },
    { path: '/system', name: 'system', component: () => import('@/view/SystemView.vue') },
    { path: '/register', name: 'register', component: () => import('@/view/RegisterView.vue')}
  ],
})


export default router
