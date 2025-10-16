import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: typeof window !== 'undefined' ? (import.meta?.env?.VITE_API_BASE_URL || '') : (process?.env?.VITE_API_BASE_URL || 'http://localhost:3000'),
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    // config.headers['Authorization'] = `Bearer ${token}`
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 根据后端返回的code判断请求状态
    if (res.code !== 0 && res.code !== 200) {
      // 处理错误
      console.error('API Error:', res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  error => {
    console.error('Network Error:', error)
    return Promise.reject(error)
  }
)

export default service
