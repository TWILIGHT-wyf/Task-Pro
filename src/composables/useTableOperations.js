import { ref, reactive, watch } from 'vue'
import request from '../utils/request'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export function useTableOperations(apiEndpoint, options = {}) {
  const {
    pageSize: defaultPageSize = 10,
    exportFilename = 'data',
    initCallback = null,
    apis = {} // API函数配置，支持传入现有的API函数
  } = options

  // 默认API函数 - 使用request工具
  const defaultApis = {
    getList: (params) => request({
      url: apiEndpoint,
      method: 'get',
      params
    }),
    create: (data) => request({
      url: apiEndpoint,
      method: 'post',
      data
    }),
    update: (id, data) => request({
      url: `${apiEndpoint}/${id}`,
      method: 'put',
      data
    }),
    delete: (id) => request({
      url: `${apiEndpoint}/${id}`,
      method: 'delete'
    }),
    batchDelete: (ids) => request({
      url: `${apiEndpoint}/batch-delete`,
      method: 'post',
      data: { ids }
    }),
    toggleStatus: (id) => request({
      url: `${apiEndpoint}/${id}/toggle-status`,
      method: 'put'
    }),
    batchEnable: (ids) => request({
      url: `${apiEndpoint}/batch-enable`,
      method: 'post',
      data: { ids }
    }),
    batchDisable: (ids) => request({
      url: `${apiEndpoint}/batch-disable`,
      method: 'post',
      data: { ids }
    }),
    export: (params) => request({
      url: `${apiEndpoint}/export`,
      method: 'get',
      params,
      responseType: 'blob'
    }),
    getStats: () => request({
      url: `${apiEndpoint}/stats`,
      method: 'get'
    })
  }

  // 合并API函数 - 支持传入自定义API函数
  const api = { ...defaultApis, ...apis }

  // 分页状态
  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)
  const totalPages = ref(1)

  // 搜索状态
  const searchKeyword = ref('')

  // 筛选状态
  const filters = reactive({})

  // 排序状态
  const sortConfig = reactive({
    sortBy: '',
    sortOrder: 'desc'
  })

  // 选中状态
  const selectedIds = ref([])
  const isAllSelected = ref(false)

  // 数据状态
  const data = ref([])
  const loading = ref(false)

  // 确认模态框状态
  const confirmModal = ref({
    visible: false,
    title: '',
    message: '',
    type: 'primary',
    confirmText: '确认',
    onConfirm: null
  })

  // 分页处理
  const handleNextPage = async () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      await fetchData()
    }
  }

  const handlePrevPage = async () => {
    if (currentPage.value > 1) {
      currentPage.value--
      await fetchData()
    }
  }

  // 搜索处理
  const handleSearch = async (keyword) => {
    searchKeyword.value = keyword
    currentPage.value = 1
    await fetchData()
  }

  // 监听搜索关键词变化
  watch(searchKeyword, async (newVal) => {
    if (newVal === '') {
      currentPage.value = 1
      await fetchData()
    }
  })

  // 筛选处理
  const handleFilter = async (filterData) => {
    Object.assign(filters, filterData)
    currentPage.value = 1
    await fetchData()
  }

  // 排序处理
  const handleSort = async (sortData) => {
    Object.assign(sortConfig, sortData)
    currentPage.value = 1
    await fetchData()
  }

  // 选中处理
  const handleSelect = (id) => {
    const index = selectedIds.value.indexOf(id)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(id)
    }
    isAllSelected.value = selectedIds.value.length === data.value.length
  }

  const handleSelectAll = (checked) => {
    isAllSelected.value = checked
    if (checked) {
      selectedIds.value = data.value.map(item => item.id)
    } else {
      selectedIds.value = []
    }
  }

  // 获取数据
  const fetchData = async () => {
    try {
      loading.value = true
      if (initCallback) {
        await initCallback()
      }
      const params = {
        page: currentPage.value,
        size: pageSize.value,
        keyword: searchKeyword.value,
        ...filters,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder
      }

      // 移除空值参数
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key]
        }
      })

      const res = await api.getList(params)
      data.value = res.data.list
      totalPages.value = Math.ceil(res.data.totalRecords / pageSize.value)
    } catch (error) {
      console.error('API调用失败:', error)
      console.error('错误详情:', error.response?.data || error.message)
    } finally {
      loading.value = false
    }
  }

  // 删除单个项目
  const handleDelete = async (id, deleteCallback = null) => {
    confirmModal.value = {
      visible: true,
      title: '确认删除',
      message: '确定删除这个项目吗？此操作不可撤销。',
      type: 'danger',
      confirmText: '删除',
      onConfirm: async () => {
        try {
          await api.delete(id)
          if (deleteCallback) await deleteCallback()
          await fetchData()
        } catch (error) {
          console.error('删除失败:', error)
          alert('删除失败，请重试')
        }
      }
    }
  }

  // 批量删除
  const handleBatchDelete = async (deleteCallback = null) => {
    if (selectedIds.value.length === 0) {
      alert('请先选择要删除的项目')
      return
    }

    confirmModal.value = {
      visible: true,
      title: '确认删除',
      message: `确定删除选中的 ${selectedIds.value.length} 个项目吗？此操作不可撤销。`,
      type: 'danger',
      confirmText: '删除',
      onConfirm: async () => {
        try {
          if (api.batchDelete) {
            // 如果有批量删除API，使用它
            await api.batchDelete(selectedIds.value)
          } else {
            // 否则逐个删除
            for (const id of selectedIds.value) {
              await api.delete(id)
            }
          }
          selectedIds.value = []
          isAllSelected.value = false
          if (deleteCallback && typeof deleteCallback === 'function') await deleteCallback()
          await fetchData()
        } catch (error) {
          console.error('批量删除失败:', error)
          alert('批量删除过程中出现错误，请检查')
        }
      }
    }
  }

  // 批量状态切换
  const handleBatchStatus = async (status, statusTextMap, statusCallback = null) => {
    if (selectedIds.value.length === 0) {
      alert(`请先选择要${statusTextMap[status] || status}的项目`)
      return
    }

    const action = statusTextMap[status] || status
    confirmModal.value = {
      visible: true,
      title: `确认${action}`,
      message: `确定${action}选中的 ${selectedIds.value.length} 个项目吗？`,
      type: status === 1 || status === 'active' ? 'primary' : 'danger',
      confirmText: action,
      onConfirm: async () => {
        try {
          // 检查是否有专门的批量状态API
          if (status === 1 && api.batchEnable) {
            await api.batchEnable(selectedIds.value)
          } else if (status === 0 && api.batchDisable) {
            await api.batchDisable(selectedIds.value)
          } else {
            // 否则逐个更新
            for (const id of selectedIds.value) {
              await api.update(id, { status })
            }
          }
          selectedIds.value = []
          isAllSelected.value = false
          if (statusCallback) await statusCallback()
          await fetchData()
        } catch (error) {
          console.error(`批量${action}失败:`, error)
          alert(`批量${action}过程中出现错误，请检查`)
        }
      }
    }
  }

  // 切换单个项目状态
  const handleToggleStatus = async (id, currentStatus, statusCallback = null) => {
    try {
      let newStatus
      if (typeof currentStatus === 'number') {
        // 数字状态：1 -> 0, 0 -> 1
        newStatus = currentStatus === 1 ? 0 : 1
      } else if (typeof currentStatus === 'string') {
        // 字符串状态：'active' -> 'inactive', 'inactive' -> 'active'
        newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      } else {
        throw new Error('Unsupported status type')
      }

      // 优先使用专门的状态切换API
      if (api.toggleStatus) {
        await api.toggleStatus(id)
      } else {
        await api.update(id, { status: newStatus })
      }
      if (statusCallback) await statusCallback()
      await fetchData()
    } catch (error) {
      console.error('状态切换失败:', error)
      alert('状态切换失败，请重试')
    }
  }

  // 导入处理
  const handleImport = async (importData, processItemCallback) => {
    if (!Array.isArray(importData) || importData.length === 0) {
      alert('导入数据无效')
      return
    }

    try {
      for (const item of importData) {
        const processedItem = processItemCallback ? processItemCallback(item) : item
        await api.create(processedItem)
      }
      alert(`成功导入 ${importData.length} 条数据`)
      await fetchData()
    } catch (error) {
      console.error('导入失败:', error)
      alert('导入过程中出现错误，请检查数据格式')
    }
  }

  // 导出处理
  const handleExport = async (format, processExportDataCallback) => {
    try {
      let exportData
      if (api.export) {
        // 如果有专门的导出API
        const res = await api.export({
          page: 1,
          size: 1000,
          keyword: searchKeyword.value,
          ...filters
        })
        exportData = res.data
      } else {
        // 否则使用列表API获取数据
        const res = await api.getList({
          page: 1,
          size: 1000,
          keyword: searchKeyword.value,
          ...filters
        })
        exportData = res.data.list
      }

      if (processExportDataCallback) {
        exportData = exportData.map(processExportDataCallback)
      }

      let blob
      const filename = `${exportFilename}.${format}`

      if (format === 'csv') {
        const csv = Papa.unparse(exportData)
        blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      } else if (format === 'xlsx') {
        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, exportFilename)
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      } else if (format === 'json') {
        const json = JSON.stringify(exportData, null, 2)
        blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
      }

      saveAs(blob, filename)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败')
    }
  }

  // 确认和取消处理
  const handleConfirm = async () => {
    if (confirmModal.value.onConfirm) {
      await confirmModal.value.onConfirm()
    }
    confirmModal.value.visible = false
  }

  const handleCancel = () => {
    confirmModal.value.visible = false
  }

  // 通用API调用方法
  const apiCall = async (method, url, data = null, config = {}) => {
    try {
      const response = await request({
        url: url.startsWith('http') ? url : `${apiEndpoint}${url}`,
        method,
        data,
        ...config
      })
      return response
    } catch (error) {
      console.error(`${method.toUpperCase()} ${url} 失败:`, error)
      throw error
    }
  }

  // 库存管理专用方法
  const stockIn = async (data) => {
    return await apiCall('post', '/stock-in', data)
  }

  const stockOut = async (data) => {
    return await apiCall('post', '/stock-out', data)
  }

  const adjustStock = async (data) => {
    return await apiCall('post', '/adjust', data)
  }

  const batchAdjustStock = async (adjustments) => {
    return await apiCall('post', '/batch-adjust', adjustments)
  }

  const getStats = async () => {
    if (api.getStats) {
      return await api.getStats()
    } else {
      return await apiCall('get', '/stats')
    }
  }

  return {
    // 状态
    currentPage,
    pageSize,
    totalPages,
    searchKeyword,
    filters,
    sortConfig,
    selectedIds,
    isAllSelected,
    data,
    loading,
    confirmModal,

    // 方法
    fetchData,
    handleNextPage,
    handlePrevPage,
    handleSearch,
    handleFilter,
    handleSort,
    handleSelect,
    handleSelectAll,
    handleDelete,
    handleBatchDelete,
    handleBatchStatus,
    handleToggleStatus,
    handleImport,
    handleExport,
    handleConfirm,
    handleCancel,

    // 通用API调用
    apiCall,

    // 库存管理方法
    stockIn,
    stockOut,
    adjustStock,
    batchAdjustStock,
    getStats
  }
}
