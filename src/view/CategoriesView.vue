
<template>
  <div class="categories-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">分类管理</h1>
        <div class="subtitle">商品分类管理 — 分类列表</div>
      </div>
      <div class="header-actions">
        <button class="btn-base btn-primary" @click="isShow = true, isEditMode = false">
          <span>➕</span> 添加分类
        </button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <div class="search-section">
      <SearchBar @search="handleSearch"></SearchBar>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar card-white">
      <div class="action-group">
        <button class="btn-base btn-danger-outline btn-small" @click="handleBatchDelete">批量删除</button>
        <button class="btn-base btn-success-outline btn-small" @click="handleBatchEnable(1)">批量启用</button>
        <button class="btn-base btn-secondary-outline btn-small" @click="handleBatchEnable(0)">批量禁用</button>
      </div>
      <div class="action-right">
        <ImportExport @import="handleImport" @export="handleExport"></ImportExport>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="table-card card-white">
      <CategoryTree
        :categories="categories"
        :all-categories="allCategories"
        :selected-ids="selectedId"
        :icon-loading="iconLoading"
        @select="select"
        @select-all="handleSelect"
        @edit="handleEdit"
        @delete="handleDelete"
        @toggle-status="handleToggleStatus"
      />
    </div>

    <!-- 分页 -->
    <div class="pagination-section card-white">
      <CustomPagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @Prev="handlePrevPage"
        @Next="handleNextPage"
      >
      </CustomPagination>
    </div>
  </div>

  <AddCategoryModal
  :visible="isShow"
  :categories="allCategories"
  :isEditMode="isEditMode"
  :editId="editId"
  @close="isShow = false"
  @submit="handleAddCategory"
  >
  </AddCategoryModal>

  <ConfirmModal
    :visible="confirmModal.visible"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :type="confirmModal.type"
    :confirmText="confirmModal.confirmText"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import AddCategoryModal from '@/components/AddCategoryModal.vue'
import CategoryTree from '@/components/CategoryTree.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import ImportExport from '@/components/ImportExport.vue'
import SearchBar from '@/components/SearchBar.vue'
import axios from 'axios'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { ref, onMounted, reactive, watch } from 'vue'

// 初始化
onMounted(async () => {
  await init()
  await fetchAllCategories()
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(null)
const handleNextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await init()
  }
}
const handlePrevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await init()
  }
}

// 搜索
const searchkeyword = ref('')
const handleSearch = async (keyword) => {
  searchkeyword.value = keyword
  await init()
}
watch(searchkeyword, async (newVal) => {
  if (newVal === '') {
    currentPage.value = 1
    await init()
  }
})

// 获取分类列表
const categories = ref()
const iconLoading = reactive({})
async function init() {
  try {
    console.log('开始调用API...')
    const res = await axios.get(`/api/categories?page=${currentPage.value}&size=${pageSize.value}&keyword=${searchkeyword.value}`)
    categories.value = res.data.data.list
    totalPages.value = Math.ceil(res.data.data.totalRecords / pageSize.value)
    // 设置图标加载状态
    categories.value.forEach(item => {
      iconLoading[item.id] = true
    })
  } catch (error) {
    console.error('API调用失败:', error)
    console.error('错误详情:', error.response?.data || error.message)
  }
}

// 获取所有分类(用于模态框中的父分类选择)
const allCategories = ref([])
async function fetchAllCategories() {
  try {
    const res = await axios.get('/api/categories?page=1&size=1000')
    allCategories.value = res.data.data.list
  } catch (error) {
    console.error('获取所有分类失败:', error)
  }
}

// 添加分类
const isShow = ref()

// 确认模态框状态
const confirmModal = ref({
  visible: false,
  title: '',
  message: '',
  type: 'primary',
  confirmText: '确认',
  onConfirm: null
})

// 更新列表
const handleAddCategory = async () => {
  searchkeyword.value = ''
  currentPage.value = 1
  await init()
  await fetchAllCategories()
  isShow.value = false
}

// 删除
const handleDelete = async (id) => {
  try {
    await axios.delete(`/api/categories/${id}`)
    await init()
    await fetchAllCategories()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 编辑分类
const isEditMode = ref(false)
const editId = ref()
const handleEdit = async (id) => {
  try {
    isEditMode.value = true
    isShow.value = true
    editId.value = id
  } catch (error) {
    console.error('编辑失败:', error)
  }
}

// 切换状态
const handleToggleStatus = async (id, status) => {


  try {
    const newStatus = status === 1 ? 0 : 1
    const res = await axios.patch(`/api/categories/${id}`, { status: newStatus });
    console.log(res.data.message);
    await init();
    await fetchAllCategories();
  } catch (error) {
    console.error('切换状态失败:', error);
    alert('切换状态失败，请重试');
  }
}

// 批量选中
const isAllSelected = ref(false)
const selectedId = ref([])
const handleSelect = (e) => {
  isAllSelected.value = e.target.checked
  if (isAllSelected.value) {
    selectedId.value = categories.value.map(item => item.id)
  }
  else {
    selectedId.value = []
  }
}
const select = (id) => {
  const index = selectedId.value.indexOf(id)
  if (index > -1) {
    selectedId.value.splice(index, 1)
  } else {
    selectedId.value.push(id)
  }
  isAllSelected.value = selectedId.value.length === categories.value.length
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedId.value.length === 0) {
    alert('请先选择要删除的项目')
    return
  }
  confirmModal.value = {
    visible: true,
    title: '确认删除',
    message: `确定删除选中的 ${selectedId.value.length} 个项目吗？此操作不可撤销。`,
    type: 'danger',
    confirmText: '删除',
    onConfirm: async () => {
      try {
        for (const id of selectedId.value) {
          await handleDelete(id)
        }
        selectedId.value = []
        isAllSelected.value = false
        await init()
        await fetchAllCategories()
      } catch (error) {
        console.error('批量删除失败:', error)
        alert('批量删除过程中出现错误，请检查')
      }
    }
  }
}

// 批量启禁用
const handleBatchEnable = async (status) => {
  if (selectedId.value.length === 0) {
    alert(`请先选择要${status === 1 ? '启用' : '禁用'}的项目`)
    return
  }
  const action = status === 1 ? '启用' : '禁用'
  confirmModal.value = {
    visible: true,
    title: `确认${action}`,
    message: `确定${action}选中的 ${selectedId.value.length} 个项目吗？`,
    type: status === 1 ? 'primary' : 'danger',
    confirmText: action,
    onConfirm: async () => {
      try {
        for (const id of selectedId.value) {
          const res = await axios.patch(`/api/categories/${id}`, { status: status })
          console.log(res.data.message)
        }
        selectedId.value = []
        isAllSelected.value = false
        await init()
        await fetchAllCategories()
      } catch (error) {
        console.error(`批量${action}失败:`, error)
        alert(`批量${action}过程中出现错误，请检查`)
      }
    }
  }
}

// 导入
const handleImport = async (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    alert('导入数据无效')
    return
  }
  try {
    for (const item of data) {
      const processeditem = {
        ...item,
        customAttrs: item.customAttrs
          .split(/[，,]/)
          .map(attr => attr.trim())
          .filter(attr => attr.length > 0)
      }
      await axios.post('/api/categories', processeditem)
    }
    alert(`成功导入 ${data.length} 条数据`)
    await init()
    await fetchAllCategories()
  } catch (error) {
    console.error('导入失败:', error)
    alert('导入过程中出现错误，请检查数据格式')
  }
}

// 导出
const handleExport = async (format) => {
  try {
    const res = await axios.get('/api/categories?page=1&size=1000')
    const data = res.data.data.list
    let blob
    const filename = `categories.${format}`

    if (format === 'csv') {
      const csv = Papa.unparse(data)
      blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    } else if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories')
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    } else if (format === 'json') {
      const json = JSON.stringify(data, null, 2)  // 格式化 JSON
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




</script>

<style lang="scss" scoped>
// 页面容器
.categories-page {
  display: flex;
  flex-direction: column;
  padding: 18px;
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
  background: #f8f9fa;
}

// 页面头部
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.subtitle {
  color: #9aa4b2;
  font-size: 13px;
  margin-top: 4px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

// 搜索区域
.search-section {
  margin-bottom: 12px;
}

// 操作栏
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
}

.action-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-right {
  display: flex;
  gap: 8px;
}

// 表格卡片
.table-card {
  overflow: hidden;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 0;
}

// 分页区域
.pagination-section {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  padding: 12px;
}
</style>
