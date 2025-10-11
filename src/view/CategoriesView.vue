
<template>
  <div class="categories-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">分类管理</h1>
        <div class="subtitle">商品分类管理 — 分类列表</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="isShow = true, isEditMode = false">
          <span>➕</span> 添加分类
        </button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <div class="search-section">
      <SearchBar @search="handleSearch"></SearchBar>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="action-group">
        <button class="btn btn-danger-outline btn-small" @click="handleBatchDelete">批量删除</button>
        <button class="btn btn-success-outline btn-small" @click="handleBatchEnable(1)">批量启用</button>
        <button class="btn btn-secondary-outline btn-small" @click="handleBatchEnable(0)">批量禁用</button>
      </div>
      <div class="action-right">
        <ImportExport @import="handleImport" @export="handleExport"></ImportExport>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="th-checkbox">
              <input type="checkbox" class="checkbox" :checked="isAllSelected" @change="handleSelect">
            </th>
            <th>ID</th>
            <th>分类名称</th>
            <th>父分类</th>
            <th>排序</th>
            <th>状态</th>
            <th>图标</th>
            <th>商品数量</th>
            <th>描述</th>
            <th>自定义属性</th>
            <th>创建时间</th>
            <th class="th-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ name,sort,productCount,description,customAttrs,createTime,id,icon,status,parentId } in categories" :key="id" class="table-row">
            <td class="td-checkbox">
              <input type="checkbox" class="checkbox" :checked="selectedId.includes(id)" @change="select(id)">
            </td>
            <td class="td-id">{{ id }}</td>
            <td class="td-name">
              <span class="name-text">{{ name }}</span>
            </td>
            <td class="td-parent">{{ parentId ? categories.find(item => item.id === parentId)?.name : '-' }}</td>
            <td class="td-sort">
              <span class="drag-handle">⋮⋮</span>
              <span class="sort-value">{{ sort }}</span>
            </td>
            <td class="td-status">
              <span :class="['status-badge', status === 1 ? 'status-enabled' : 'status-disabled']">
                {{ status === 1 ? '启用' : '未启用'}}
              </span>
            </td>
            <td class="td-icon">
              <div v-if="iconLoading[id]" class="icon-loading">
                <span class="loading-spinner">⏳</span>
              </div>
              <img v-else :src="icon" alt="图标" class="category-icon" @load="iconLoading[id] = false" @error="iconLoading[id] = false">
            </td>
            <td class="td-count">
              <span class="count-badge">{{ productCount }}</span>
            </td>
            <td class="td-desc">{{ description || '-' }}</td>
            <td class="td-attrs">
              <span class="custom-attr" v-for="atter in customAttrs" :key="atter">{{ atter }}</span>
            </td>
            <td class="td-time">{{ createTime }}</td>
            <td class="td-actions">
              <button class="btn-action btn-edit" @click="handleEdit(id)">编辑</button>
              <button class="btn-action btn-delete" @click="handleDelete(id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
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
  :categories="categories"
  :isEditMode="isEditMode"
  :editId="editId"
  @close="isShow = false"
  @submit="handleAddCategory"
  >
  </AddCategoryModal>

</template>

<script setup>
import AddCategoryModal from '@/components/AddCategoryModal.vue'
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

// 添加分类
const isShow = ref()

// 更新列表
const handleAddCategory = async () => {
  await init()
  isShow.value = false
}

// 删除
const handleDelete = async (id) => {
  try {
    await axios.delete(`/api/categories/${id}`)
    await init()
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
  if (!confirm(`确定删除选中的 ${selectedId.value.length} 个项目吗？`)) {
    return
  }
  try {
    for (const id of selectedId.value) {
      await handleDelete(id)
    }
    selectedId.value = []
    isAllSelected.value = false
  } catch (error) {
    console.error('批量删除失败:', error)
    alert('批量删除过程中出现错误，请检查')
  }
}

// 批量启禁用
const handleBatchEnable = async (status) => {
  if (selectedId.value.length === 0) {
    alert(`请先选择要${status === 1 ? '启用' : '禁用'}的项目`)
    return
  }
  const action = status === 1 ? '启用' : '禁用'
  if (!confirm(`确定${action}选中的 ${selectedId.value.length} 个项目吗？`)) {
    return
  }
  try {
    for (const id of selectedId.value) {
      const res = await axios.patch(`/api/categories/${id}`, { status: status })
      console.log(res.data.message)
    }
    selectedId.value = []
    isAllSelected.value = false
    await init()
  } catch (error) {
    console.error(`批量${action}失败:`, error)
    alert(`批量${action}过程中出现错误，请检查`)
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

// 按钮样式（与仪表盘一致）
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &.btn-small {
    padding: 6px 12px;
    font-size: 13px;
  }

  &.btn-primary {
    background: #10b981;
    color: #fff;
    border-color: rgba(16, 185, 129, 0.9);

    &:hover {
      background: #059669;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  }

  &.btn-danger-outline {
    background: #fff;
    color: #ef4444;
    border-color: #ef4444;

    &:hover {
      background: #fef2f2;
      border-color: #dc2626;
    }
  }

  &.btn-success-outline {
    background: #fff;
    color: #10b981;
    border-color: #10b981;

    &:hover {
      background: #f0fdf4;
      border-color: #059669;
    }
  }

  &.btn-secondary-outline {
    background: #fff;
    color: #6b7280;
    border-color: #d1d5db;

    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  }
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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.06);
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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.06);
  overflow: hidden;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #f8f9fa;
  }

  th {
    padding: 12px 14px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    white-space: nowrap;

    &.th-checkbox {
      width: 40px;
      text-align: center;
    }

    &.th-actions {
      text-align: center;
    }
  }

  tbody tr {
    transition: background-color 0.15s ease;

    &:hover {
      background: #f9fafb;
    }
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid #eef2f6;
    color: #4b5563;
    vertical-align: middle;

    &.td-checkbox {
      text-align: center;
    }

    &.td-id {
      color: #9ca3af;
      font-size: 12px;
    }

    &.td-name {
      font-weight: 500;
      color: #111827;

      .name-text {
        display: inline-block;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &.td-parent {
      color: #6b7280;
    }

    &.td-sort {
      .drag-handle {
        cursor: move;
        color: #9ca3af;
        margin-right: 6px;
        font-size: 14px;
      }

      .sort-value {
        color: #4b5563;
        font-weight: 500;
      }
    }

    &.td-status {
      .status-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.status-enabled {
          background: #d1fae5;
          color: #065f46;
        }

        &.status-disabled {
          background: #fee2e2;
          color: #991b1b;
        }
      }
    }

    &.td-icon {
      .category-icon {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        object-fit: cover;
        border: 1px solid #e5e7eb;
      }

      .icon-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #f3f7fb, #ffffff);
        border-radius: 6px;
        border: 1px solid #e5e7eb;
        font-size: 12px;
        color: #9ca3af;

        .loading-spinner {
          font-size: 16px;
        }
      }
    }

    &.td-count {
      .count-badge {
        display: inline-block;
        padding: 4px 10px;
        background: #eff6ff;
        color: #1e40af;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }
    }

    &.td-desc {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #6b7280;
    }

    &.td-attrs {
      .custom-attr {
        display: inline-block;
        background: #f3f4f6;
        color: #374151;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        margin-right: 4px;
        margin-bottom: 4px;
      }
    }

    &.td-time {
      color: #9ca3af;
      font-size: 12px;
      white-space: nowrap;
    }

    &.td-actions {
      text-align: center;
      white-space: nowrap;

      .btn-action {
        padding: 5px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        margin: 0 3px;
        transition: all 0.2s ease;

        &.btn-edit {
          background: #fef3c7;
          color: #92400e;

          &:hover {
            background: #fde68a;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
          }
        }

        &.btn-delete {
          background: #fee2e2;
          color: #991b1b;

          &:hover {
            background: #fecaca;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
          }
        }
      }
    }
  }
}

.checkbox {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #10b981;
}

// 分页区域
.pagination-section {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.06);
}
</style>
