import axios from 'axios'
import router from '@/router'

let isRefreshing = false
let refreshGate = null
let rejectRefreshGate = null

const getRefreshGate = () => {
  if (!refreshGate) {
    refreshGate = new Promise((_, reject) => {
      rejectRefreshGate = reject
    })
  }
  return refreshGate
}

const resetRefreshStateIfTokenRestored = () => {
  const token = localStorage.getItem('token')
  if (isRefreshing && token) {
    isRefreshing = false
    refreshGate = null
    rejectRefreshGate = null
  }
}

const createApiError = (message, originalError) => {
  const err = new Error(message)
  err.isAxiosError = !!originalError?.isAxiosError
  err.code = originalError?.code
  err.config = originalError?.config
  err.response = originalError?.response
  return err
}

let onAuthExpired = ({ redirect }) => {
  try {
    alert('登录已过期，请重新登录')
  } catch {
    // ignore
  }
  router.push({ path: '/login', query: { redirect } })
}

export const setOnAuthExpired = (handler) => {
  onAuthExpired = typeof handler === 'function' ? handler : onAuthExpired
}

const isBinaryResponse = (response) => {
  const rt = response?.config?.responseType
  if (rt && rt !== 'json') return true
  const d = response?.data
  return d instanceof Blob || d instanceof ArrayBuffer
}

const isEnvelope = (data) => {
  return data && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, 'code')
}

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    resetRefreshStateIfTokenRestored()

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
    if (isBinaryResponse(response)) return response.data

    const data = response.data

    if (isEnvelope(data)) {
      if (data.code !== 0 && data.code !== 200) {
        const error = createApiError(data.message || '请求失败')
        error.response = { data, status: response.status, headers: response.headers, config: response.config }
        return Promise.reject(error)
      }
      return data
    }

    return data
  },
  error => {
    if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') {
      return Promise.reject(error)
    }

    console.error('响应错误:', error)

    if (error.response) {
      const { status, data } = error.response

      // 检测 401 状态码或后端返回的 code 为 401
      if (status === 401 || data?.code === 401) {
        const reloginError = createApiError('Token 已失效，请重新登录', error)
        const gate = getRefreshGate()

        if (!isRefreshing) {
          isRefreshing = true
          localStorage.removeItem('token')

        
          onAuthExpired({ redirect: router.currentRoute.value.fullPath })

          rejectRefreshGate?.(reloginError)
        }

        return gate
      }
    }

    return Promise.reject(error)
  }
)

export default service
