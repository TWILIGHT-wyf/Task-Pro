
<template>
  <div class="categories-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">分类管理</h1>
        <div class="subtitle">商品分类管理 — 分类列表</div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="isShow = true, isEditMode = false">
          <el-icon><Plus /></el-icon> 添加分类
        </el-button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <div class="search-section">
      <SearchBar @search="handleSearch" placeholder="搜索分类名称"/>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar card-white">
      <BatchActions
        :actions="batchActions"
        @action="handleBatchAction"
      />
      <div class="action-right">
        <ImportExport @import="handleImport" @export="handleExport"/>
      </div>
    </div>

    <!-- 分类列表 -->
  <div class="table-card card-white" ref="tableCardRef">
      <CategoryTree
        :categories="categories"
        :all-categories="allCategories"
        :selected-ids="selectedIds"
        :icon-loading="iconLoading"
        :extra-include-ids="extraIncludeIds"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @edit="handleEdit"
        @delete="handleDelete"
        @toggle-status="handleToggleStatus"
      />
    </div>

    <!-- 分页 -->
    <div class="pagination-section card-white">
      <CustomPagination
        :currentPage="currentPage"
        :pageSize="pageSize"
        :total="total"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />

    </div>
  </div>

  <AddModal
    v-model:visible="isShow"
    title="分类"
    icon=""
    :fields="categoryFields"
    :is-edit-mode="isEditMode"
    :edit-data="editData"
    @submit="handleAddCategory"
  />


  <ConfirmModal
    v-model:visible="confirmModal.visible"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :type="confirmModal.type"
    :confirmText="confirmModal.confirmText"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import AddModal from '@/components/AddModal.vue'
import CategoryTree from '@/components/CategoryTree.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import ImportExport from '@/components/ImportExport.vue'
import SearchBar from '@/components/SearchBar.vue'
import BatchActions from '@/components/BatchActions.vue'
import { useTableOperations } from '@/composables/useTableOperations'
import { getCategories, createCategory, updateCategory, deleteCategory, batchDeleteCategories, toggleCategoryStatus, batchEnableCategories, batchDisableCategories, exportCategories } from '@/api'
import { ref, onMounted, nextTick, reactive, computed, watch } from 'vue'
import { useResponsivePageSize } from '@/composables/useResponsivePageSize'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 初始化
onMounted(async () => {
  await nextTick()
  computeResponsivePageSize()
  await fetchData()
})

// 使用通用表格操作逻辑
const {
  currentPage,
  pageSize,
  total,
  searchKeyword,
  data: categories,
  selectedIds,
  confirmModal,
  fetchData,
  handleSelect,
  handleSearch,
  handleSelectAll,
  handleDelete,
  handleBatchDelete,
  handleBatchStatus,
  handleToggleStatus,
  handleImport,
  handleExport,
  handleConfirm,
  handleCancel
} = useTableOperations('/api/categories', {
  pageSize: 1000,
  exportFilename: 'categories',
  initCallback: fetchAllCategories,
  apis: {
    getList: getCategories,
    create: createCategory,
    update: updateCategory,
    delete: deleteCategory,
    batchDelete: batchDeleteCategories,
    toggleStatus: toggleCategoryStatus,
    batchEnable: batchEnableCategories,
    batchDisable: batchDisableCategories,
    export: exportCategories
  }
})

// 定义批量操作配置
const batchActions = [
  { key: 'delete', label: '批量删除', class: 'btn-base btn-danger-outline btn-small' },
  { key: 'enable', label: '批量启用', class: 'btn-base btn-success-outline btn-small' },
  { key: 'disable', label: '批量禁用', class: 'btn-base btn-secondary-outline btn-small' }
]

// 获取所有分类(用于模态框中的父分类选择)
const allCategories = ref([])
const iconLoading = reactive({})
async function fetchAllCategories() {
  try {
    const size = 500
    let page = 1
    let total = Infinity
    const acc = []
    while (acc.length < total) {
      const res = await getCategories({ page, size })
      const list = res?.data?.list || []
      total = res?.data?.totalRecords ?? list.length
      acc.push(...list)
      if (list.length < size) break
      page += 1
    }
    allCategories.value = acc
  } catch (error) {
    console.error('获取所有分类失败:', error)
  }
}

// 添加分类
const isShow = ref(false)
const isEditMode = ref(false)
const editData = ref(null)
// 强制额外包含在树中的分类ID（用于新建后立即显示）
const extraIncludeIds = ref([])

// 使用抽离的可视区域自适应逻辑
const { containerRef: tableCardRef, computeResponsivePageSize } = useResponsivePageSize({
  pageSizeRef: pageSize,
  // 树表格每项可能带出祖先行，适当提高行高或行因子，避免溢出
  rowHeight: 58,
  rowFactor: 1.15,
  reserveRows: 1,
  onChange: async () => {
    await fetchData()
  }
})

// 分类表单字段配置
const categoryFields = ref([
  {
    key: 'name',
    label: '分类名称',
    type: 'text',
    required: true,
    placeholder: '请输入分类名称',
    default: ''
  },
  {
    key: 'description',
    label: '描述',
    type: 'textarea',
    required: false,
    placeholder: '请输入分类描述',
    default: '',
    rows: 3
  },
  {
    key: 'parentId',
    label: '父分类',
    type: 'select',
    required: false,
    options: computed(() => [
      { value: null, label: '无父分类' },
      ...(allCategories.value || []).map(item => ({
        value: item.id,
        label: item.name
      }))
    ]),
    default: null
  },
  {
    key: 'sort',
    label: '排序',
    type: 'number',
    required: true,
    placeholder: '请输入排序号',
    default: 0,
    min: 1
  },
  {
    key: 'status',
    label: '状态',
    type: 'radio',
    required: false,
    options: [
      { value: 1, label: '启用' },
      { value: 0, label: '禁用' }
    ],
    default: 1
  },
  {
    key: 'icon',
    label: '图标URL',
    type: 'url',
    required: true,
    placeholder: '请输入图标URL',
    default: ''
  },
  {
    key: 'customAttrs',
    label: '自定义属性',
    type: 'text',
    required: false,
    placeholder: '多个属性用逗号分隔，例如：热门,推荐',
    default: '',
    hint: '多个属性请用逗号分隔'
  }
])

// 更新列表
const handleAddCategory = async (formData) => {
  try {
    // 处理自定义属性
    const processedForm = { ...formData }
    if (processedForm.customAttrs) {
      processedForm.customAttrs = processedForm.customAttrs
        .split(/[，,]/)
        .map(attr => attr.trim())
        .filter(attr => attr.length > 0)
    } else {
      processedForm.customAttrs = []
    }

    if (isEditMode.value) {
      await updateCategory(processedForm.id, processedForm)
      ElMessage.success('更新分类成功')
    } else {
      const res = await createCategory(processedForm)
      const newId = res?.data?.id
      if (newId != null) {
        extraIncludeIds.value = [newId]
      }
      ElMessage.success('添加分类成功')
    }

    searchKeyword.value = ''
    currentPage.value = 1
    await fetchData()
    await fetchAllCategories()
    isShow.value = false
  } catch (error) {
    console.error('保存分类失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 编辑分类
const handleEdit = async (id) => {
  try {
    const category = categories.value.find(c => c.id === id)
    if (category) {
      isEditMode.value = true
      editData.value = { ...category }
      isShow.value = true
    }
  } catch (error) {
    console.error('编辑失败:', error)
  }
}

// 翻页或搜索时，清理额外包含的ID（避免长期“越权”显示跨页节点）
watch(currentPage, () => { extraIncludeIds.value = [] })
watch(searchKeyword, () => { extraIncludeIds.value = [] })

// 批量启禁用 (使用通用函数)
const handleBatchEnable = async (status) => {
  const statusTextMap = { 1: '启用', 0: '禁用' }
  await handleBatchStatus(status, statusTextMap, async () => {
    await fetchAllCategories()
  })
}

// 统一处理批量操作
// eslint-disable-next-line no-unused-vars
const handleBatchAction = (actionKey, params) => {
  switch (actionKey) {
    case 'delete':
      handleBatchDelete()
      break
    case 'enable':
      handleBatchEnable(1)
      break
    case 'disable':
      handleBatchEnable(0)
      break
  }
}

// 分页事件处理
const handlePageChange = async (page) => {
  currentPage.value = page
  await fetchData()
}

const handleSizeChange = async (size) => {
  pageSize.value = size
  currentPage.value = 1
  await fetchData()
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
  overflow: visible;
  flex: 1 1 auto;
  min-height: 0;
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
