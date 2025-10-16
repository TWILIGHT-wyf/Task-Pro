/**
 * 格式化数字，添加千分位逗号
 * @param {number|string} num - 要格式化的数字
 * @returns {string} 格式化后的字符串
 * @example formatNumber(1234567) => "1,234,567"
 */
export function formatNumber(num) {
  if (num === null || num === undefined || num === '') return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化货币
 * @param {number} amount - 金额
 * @param {string} symbol - 货币符号，默认为 ¥
 * @param {number} decimals - 小数位数，默认为 2
 * @returns {string} 格式化后的货币字符串
 * @example formatCurrency(1234.5) => "¥1,234.50"
 */
export function formatCurrency(amount, symbol = '¥', decimals = 2) {
  if (amount === null || amount === undefined || amount === '') return `${symbol}0.00`
  const num = Number(amount).toFixed(decimals)
  return `${symbol}${formatNumber(num)}`
}

/**
 * 格式化日期时间
 * @param {string|Date} date - 日期对象或字符串
 * @param {string} format - 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '-'

  const d = typeof date === 'string' ? new Date(date) : date

  if (isNaN(d.getTime())) return '-'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数，默认为 2
 * @returns {string} 格式化后的文件大小
 * @example formatFileSize(1024) => "1.00 KB"
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

/**
 * 格式化百分比
 * @param {number} value - 数值
 * @param {number} total - 总数
 * @param {number} decimals - 小数位数，默认为 1
 * @returns {string} 格式化后的百分比
 * @example formatPercent(25, 100) => "25.0%"
 */
export function formatPercent(value, total, decimals = 1) {
  if (!total || total === 0) return '0%'
  const percent = (value / total) * 100
  return percent.toFixed(decimals) + '%'
}

/**
 * 截断文本
 * @param {string} text - 要截断的文本
 * @param {number} length - 最大长度
 * @param {string} suffix - 后缀，默认为 '...'
 * @returns {string} 截断后的文本
 */
export function truncate(text, length, suffix = '...') {
  if (!text || text.length <= length) return text
  return text.substring(0, length) + suffix
}

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn - 要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))

  const clonedObj = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }
  return clonedObj
}

/**
 * 生成随机ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID
 */
export function generateId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * 获取时间范围
 * @param {string} range - 时间范围类型 ('today', 'week', 'month', 'year')
 * @returns {object} { startDate, endDate }
 */
export function getDateRange(range) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()
  const day = now.getDay()

  let startDate, endDate

  switch (range) {
    case 'today':
      startDate = new Date(year, month, date, 0, 0, 0)
      endDate = new Date(year, month, date, 23, 59, 59)
      break

    case 'week': {
      // 本周一到今天
      const mondayOffset = day === 0 ? -6 : 1 - day
      startDate = new Date(year, month, date + mondayOffset, 0, 0, 0)
      endDate = new Date(year, month, date, 23, 59, 59)
      break
    }

    case 'month':
      startDate = new Date(year, month, 1, 0, 0, 0)
      endDate = new Date(year, month + 1, 0, 23, 59, 59)
      break

    case 'year':
      startDate = new Date(year, 0, 1, 0, 0, 0)
      endDate = new Date(year, 11, 31, 23, 59, 59)
      break

    default:
      startDate = new Date(year, month, date, 0, 0, 0)
      endDate = new Date(year, month, date, 23, 59, 59)
  }

  return {
    startDate: formatDate(startDate, 'YYYY-MM-DD'),
    endDate: formatDate(endDate, 'YYYY-MM-DD')
  }
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * 验证手机号格式（中国）
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export function isValidPhone(phone) {
  const re = /^1[3-9]\d{9}$/
  return re.test(phone)
}

/**
 * 下载文件
 * @param {string} url - 文件URL
 * @param {string} filename - 文件名
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 将对象转换为查询字符串
 * @param {object} params - 参数对象
 * @returns {string} 查询字符串
 */
export function objectToQueryString(params) {
  return Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
}

/**
 * 将查询字符串转换为对象
 * @param {string} queryString - 查询字符串
 * @returns {object} 参数对象
 */
export function queryStringToObject(queryString) {
  const params = {}
  const pairs = (queryString[0] === '?' ? queryString.slice(1) : queryString).split('&')

  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '')
    }
  }

  return params
}
