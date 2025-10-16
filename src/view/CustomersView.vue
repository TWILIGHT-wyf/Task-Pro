<template>
  <div class="customers-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">会员管理</h1>
        <div class="subtitle">会员管理 — 会员列表</div>
      </div>
      <div class="header-actions">
        <button class="btn-base btn-primary" @click="showAddModal">
          <span>➕</span> 添加会员
        </button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <SearchBar placeholder="搜索会员姓名、邮箱或电话..." @search="handleSearch" />

    <!-- 筛选排序 -->
        <!-- 筛选排序 -->
    <CustomFilter
      :filter-configs="customerFilterConfigs"
      :sort-configs="customerSortConfigs"
      @filter="handleFilter"
      @sort="handleSort"
      ref="customerFilterRef"
    />

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

    <!-- 会员列表 -->
  <div class="table-card card-white" ref="tableCardRef">
      <CustomTable
        :data="customers"
        :selected-ids="selectedIds"
        :headers="customerHeaders"
        :status-text-map="{ active: '活跃', inactive: '非活跃' }"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @edit="handleEdit"
        @delete="handleDelete"
        @view="handleView"
        @toggle-status="handleToggleStatus"
      />
    </div>

    <!-- 分页 -->
    <div class="pagination-section card-white">
      <CustomPagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="handlePrevPage"
        @next="handleNextPage"
      />
    </div>
  </div>

  <AddModal
    :visible="isShow"
    title="会员"
    icon="👤"
    :fields="customerFields"
    :is-edit-mode="isEditMode"
    :edit-data="editData"
    @close="isShow = false"
    @submit="handleAddCustomer"
  />

  <ConfirmModal
    :visible="confirmModal.visible"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :type="confirmModal.type"
    :confirmText="confirmModal.confirmText"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />

  <!-- 会员详情模态框 -->
  <DetailModal
    :visible="showDetailModal"
    :data="currentCustomer"
    title="会员详情"
    :sections="customerDetailSections"
    @close="showDetailModal = false"
    @edit="handleEditFromDetail"
  />
</template>

<script setup>
import AddModal from '@/components/AddModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import CustomTable from '@/components/CustomTable.vue'
import CustomFilter from '@/components/CustomFilter.vue'
import ImportExport from '@/components/ImportExport.vue'
import SearchBar from '@/components/SearchBar.vue'
import DetailModal from '@/components/DetailModal.vue'
import BatchActions from '@/components/BatchActions.vue'
import { useTableOperations } from '@/composables/useTableOperations'
import { createCustomer, updateCustomer } from '@/api'
import { ref, onMounted } from 'vue'
import { useResponsivePageSize } from '@/composables/useResponsivePageSize'

// 使用通用表格操作逻辑
const {
  currentPage,
  pageSize,
  totalPages,
  searchKeyword,
  selectedIds,
  data: customers,
  confirmModal,
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
  handleCancel
} = useTableOperations('/api/customers', {
  exportFilename: 'customers'
})

// 初始化
onMounted(async () => {
  computeResponsivePageSize()
  await fetchData()
})

// 定义批量操作配置
const batchActions = [
  { key: 'delete', label: '批量删除', class: 'btn-base btn-danger-outline btn-small' },
  { key: 'activate', label: '批量激活', class: 'btn-base btn-success-outline btn-small' },
  { key: 'disable', label: '批量禁用', class: 'btn-base btn-secondary-outline btn-small' }
]

// 添加会员
const isShow = ref(false)
const isEditMode = ref(false)
const editData = ref(null)

// 响应式每页数量：根据表格容器高度计算
const tableCardRef = ref(null)
const { computeResponsivePageSize } = useResponsivePageSize({
  pageSizeRef: pageSize,
  containerRef: tableCardRef,
  onChange: async () => {
    await fetchData()
  }
})

// 会员表单字段配置
const customerFields = ref([
  {
    key: 'name',
    label: '姓名',
    type: 'text',
    required: true,
    placeholder: '请输入会员姓名',
    default: ''
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'email',
    required: true,
    placeholder: '请输入邮箱地址',
    default: ''
  },
  {
    key: 'phone',
    label: '电话',
    type: 'tel',
    required: true,
    placeholder: '请输入电话号码',
    default: ''
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { value: 'active', label: '活跃' },
      { value: 'inactive', label: '非活跃' }
    ],
    default: 'active'
  }
])

// 会员表格列配置
const customerHeaders = ref([
  { key: 'id', label: 'ID', type: 'text' },
  { key: 'name', label: '姓名', type: 'avatar' },
  { key: 'email', label: '邮箱', type: 'email' },
  { key: 'phone', label: '电话', type: 'phone' },
  { key: 'status', label: '状态', type: 'status-badge' },
  { key: 'createdAt', label: '注册时间', type: 'date' }
])

// 会员详情配置
const customerDetailSections = ref([
  {
    title: '基本信息',
    fields: [
      { key: 'name', label: '姓名', type: 'text' },
      { key: 'email', label: '邮箱', type: 'text' },
      { key: 'phone', label: '电话', type: 'text' },
      { key: 'status', label: '状态', type: 'status', formatValue: (value) => value === 'active' ? '活跃' : '非活跃' }
    ]
  },
  {
    title: '时间信息',
    fields: [
      { key: 'createdAt', label: '注册时间', type: 'date' },
      { key: 'updatedAt', label: '最后更新', type: 'date' }
    ]
  }
])

// 会员筛选配置
const customerFilterConfigs = ref([
  {
    key: 'status',
    label: '状态筛选',
    type: 'select',
    placeholder: '全部状态',
    options: [
      { value: 'active', label: '活跃' },
      { value: 'inactive', label: '非活跃' }
    ]
  }
])

// 会员排序配置
const customerSortConfigs = ref([
  { value: 'createdAt', label: '按注册时间' },
  { value: 'name', label: '按姓名' }
])

// 查看详情状态
const showDetailModal = ref(false)
const currentCustomer = ref(null)

const showAddModal = () => {
  isShow.value = true
  isEditMode.value = false
  editData.value = null
}

// 更新列表
const handleAddCustomer = async (formData) => {
  try {
    if (isEditMode.value) {
      await updateCustomer(formData.id, formData)
    } else {
      await createCustomer(formData)
    }
    searchKeyword.value = ''
    currentPage.value = 1
    await fetchData()
    isShow.value = false
  } catch (error) {
    console.error('保存会员失败:', error)
    alert('保存失败，请重试')
  }
}

// 编辑会员
const handleEdit = async (id) => {
  try {
    const customer = customers.value.find(c => c.id === id)
    if (customer) {
      isEditMode.value = true
      editData.value = { ...customer }
      isShow.value = true
    }
  } catch (error) {
    console.error('编辑失败:', error)
  }
}

// 查看会员详情
const handleView = (id) => {
  const customer = customers.value.find(c => c.id === id)
  if (customer) {
    currentCustomer.value = customer
    showDetailModal.value = true
  }
}

// 从详情模态框编辑会员
const handleEditFromDetail = (id) => {
  handleEdit(id)
}

// 统一处理批量操作
// eslint-disable-next-line no-unused-vars
const handleBatchAction = (actionKey, params) => {
  switch (actionKey) {
    case 'delete':
      handleBatchDelete()
      break
    case 'activate':
      handleBatchStatus('active')
      break
    case 'disable':
      handleBatchStatus('inactive')
      break
  }
}
</script>

<style lang="scss" scoped>
// 页面容器
.customers-page {
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
