import axios from 'axios'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: typeof window !== 'undefined' ? (import.meta?.env?.VITE_API_BASE_URL || '') : (process?.env?.VITE_API_BASE_URL || 'http://localhost:3000'),
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')

    // 如果 token 存在，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 根据后端返回的code判断请求状态
    if (res.code !== 0 && res.code !== 200) {
      // 处理错误，创建一个错误对象以便传递消息
      const error = new Error(res.message || '请求失败')
      error.response = { data: res }
      console.error('API Error:', res.message || '请求失败')
      return Promise.reject(error)
    }

    return res
  },
  error => {
    console.error('响应错误:', error)

    // 处理 401 未授权错误
    if (error.response) {
      const { status, data } = error.response

      // 检测 401 状态码或后端返回的 code 为 401
      if (status === 401 || data?.code === 401) {
        console.warn('Token 已失效，请重新登录')

        // 清除本地 token
        localStorage.removeItem('token')

        // 跳转到登录页
        // 使用 router.currentRoute.value.fullPath 保存当前路径，以便登录后跳转回来
        const currentPath = router.currentRoute.value.fullPath
        router.push({
          path: '/login',
          query: { redirect: currentPath }
        })

        return Promise.reject(new Error('Token 已失效，请重新登录'))
      }
    }

    return Promise.reject(error)
  }
)

export default service
