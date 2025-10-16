<template>
  <div class="orders-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">订单管理</h1>
        <div class="subtitle">订单管理 — 订单列表</div>
      </div>
      <div class="header-actions">
        <button class="btn-base btn-primary" @click="showAddModal">
          <span>➕</span> 添加订单
        </button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <SearchBar placeholder="搜索订单号、客户姓名或商品名称..." @search="handleSearch" />

    <!-- 筛选排序 -->
    <CustomFilter
      :filter-configs="orderFilterConfigs"
      :sort-configs="orderSortConfigs"
      @filter="handleFilter"
      @sort="handleSort"
      ref="orderFilterRef"
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

    <!-- 订单列表 -->
  <div class="table-card card-white" ref="tableCardRef">
      <CustomTable
        :data="orders"
        :selected-ids="selectedIds"
        :headers="orderHeaders"
        :status-text-map="{ pending: '待支付', paid: '已支付', shipped: '已发货', completed: '已完成', cancelled: '已取消' }"
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
    title="订单"
    icon="📦"
    :fields="orderFields"
    :is-edit-mode="isEditMode"
    :edit-data="editData"
    @close="isShow = false"
    @submit="handleAddOrder"
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

  <!-- 订单详情模态框 -->
  <DetailModal
    :visible="showDetailModal"
    :data="currentOrder"
    title="订单详情"
    :sections="orderDetailSections"
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
import { createOrder, updateOrder, updateOrderStatus } from '@/api'
import { ref, onMounted } from 'vue'
import { useResponsivePageSize } from '@/composables/useResponsivePageSize'

// 使用通用表格操作逻辑
const {
  currentPage,
  pageSize,
  totalPages,
  searchKeyword,
  selectedIds,
  data: orders,
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
  handleImport,
  handleExport,
  handleConfirm,
  handleCancel
} = useTableOperations('/api/orders', {
  exportFilename: 'orders'
})

// 初始化
onMounted(async () => {
  computeResponsivePageSize()
  await fetchData()
})

// 定义批量操作配置
const batchActions = [
  { key: 'delete', label: '批量删除', class: 'btn-base btn-danger-outline btn-small' },
  { key: 'paid', label: '批量标记已支付', class: 'btn-base btn-success-outline btn-small' },
  { key: 'shipped', label: '批量标记已发货', class: 'btn-base btn-primary-outline btn-small' },
  { key: 'completed', label: '批量标记已完成', class: 'btn-base btn-secondary-outline btn-small' }
]

// 添加订单
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

// 订单表单字段配置
const orderFields = ref([
  {
    key: 'orderNumber',
    label: '订单号',
    type: 'text',
    required: true,
    placeholder: '请输入订单号',
    default: ''
  },
  {
    key: 'customerName',
    label: '客户姓名',
    type: 'text',
    required: true,
    placeholder: '请输入客户姓名',
    default: ''
  },
  {
    key: 'customerEmail',
    label: '客户邮箱',
    type: 'email',
    required: true,
    placeholder: '请输入客户邮箱',
    default: ''
  },
  {
    key: 'customerPhone',
    label: '客户电话',
    type: 'tel',
    required: true,
    placeholder: '请输入客户电话',
    default: ''
  },
  {
    key: 'productName',
    label: '商品名称',
    type: 'text',
    required: true,
    placeholder: '请输入商品名称',
    default: ''
  },
  {
    key: 'quantity',
    label: '数量',
    type: 'number',
    required: true,
    placeholder: '请输入数量',
    default: 1,
    min: 1
  },
  {
    key: 'unitPrice',
    label: '单价',
    type: 'number',
    required: true,
    placeholder: '请输入单价',
    default: '',
    min: 0,
    step: 0.01
  },
  {
    key: 'totalAmount',
    label: '总金额',
    type: 'number',
    required: true,
    placeholder: '请输入总金额',
    default: '',
    min: 0,
    step: 0.01
  },
  {
    key: 'status',
    label: '订单状态',
    type: 'select',
    options: [
      { value: 'pending', label: '待支付' },
      { value: 'paid', label: '已支付' },
      { value: 'shipped', label: '已发货' },
      { value: 'completed', label: '已完成' },
      { value: 'cancelled', label: '已取消' }
    ],
    default: 'pending'
  },
  {
    key: 'shippingAddress',
    label: '收货地址',
    type: 'textarea',
    required: true,
    placeholder: '请输入收货地址',
    default: '',
    rows: 3
  },
  {
    key: 'notes',
    label: '备注',
    type: 'textarea',
    required: false,
    placeholder: '请输入备注信息',
    default: '',
    rows: 2
  }
])

// 订单表格列配置
const orderHeaders = ref([
  { key: 'id', label: 'ID', type: 'text' },
  { key: 'orderNumber', label: '订单号', type: 'text' },
  { key: 'customerName', label: '客户姓名', type: 'text' },
  { key: 'customerEmail', label: '客户邮箱', type: 'email' },
  { key: 'customerPhone', label: '客户电话', type: 'phone' },
  { key: 'productName', label: '商品名称', type: 'text' },
  { key: 'quantity', label: '数量', type: 'text' },
  { key: 'unitPrice', label: '单价', type: 'price' },
  { key: 'totalAmount', label: '总金额', type: 'price' },
  { key: 'status', label: '状态', type: 'status-badge' },
  { key: 'createdAt', label: '下单时间', type: 'date' }
])

// 订单详情配置
const orderDetailSections = ref([
  {
    title: '订单信息',
    fields: [
      { key: 'orderNumber', label: '订单号', type: 'text' },
      { key: 'status', label: '订单状态', type: 'status', formatValue: (value) => {
        const statusMap = {
          'pending': '待支付',
          'paid': '已支付',
          'shipped': '已发货',
          'completed': '已完成',
          'cancelled': '已取消'
        }
        return statusMap[value] || value
      }}
    ]
  },
  {
    title: '客户信息',
    fields: [
      { key: 'customerName', label: '客户姓名', type: 'text' },
      { key: 'customerEmail', label: '客户邮箱', type: 'text' },
      { key: 'customerPhone', label: '客户电话', type: 'text' }
    ]
  },
  {
    title: '商品信息',
    fields: [
      { key: 'productName', label: '商品名称', type: 'text' },
      { key: 'quantity', label: '数量', type: 'text' },
      { key: 'unitPrice', label: '单价', type: 'currency' },
      { key: 'totalAmount', label: '总金额', type: 'currency' }
    ]
  },
  {
    title: '其他信息',
    fields: [
      { key: 'shippingAddress', label: '收货地址', type: 'text' },
      { key: 'notes', label: '备注', type: 'text' },
      { key: 'createdAt', label: '下单时间', type: 'date' },
      { key: 'updatedAt', label: '最后更新', type: 'date' }
    ]
  }
])

// 订单筛选配置
const orderFilterConfigs = ref([
  {
    key: 'status',
    label: '状态筛选',
    type: 'select',
    placeholder: '全部状态',
    options: [
      { value: 'pending', label: '待支付' },
      { value: 'paid', label: '已支付' },
      { value: 'shipped', label: '已发货' },
      { value: 'completed', label: '已完成' },
      { value: 'cancelled', label: '已取消' }
    ]
  },
  {
    key: 'totalAmount',
    label: '金额范围',
    type: 'range',
    placeholder: { min: '最低金额', max: '最高金额' },
    min: 0,
    step: 0.01
  }
])

// 订单排序配置
const orderSortConfigs = ref([
  { value: 'createdAt', label: '按下单时间' },
  { value: 'totalAmount', label: '按金额' },
  { value: 'customerName', label: '按客户姓名' }
])

// 查看详情状态
const showDetailModal = ref(false)
const currentOrder = ref(null)

const showAddModal = () => {
  isShow.value = true
  isEditMode.value = false
  editData.value = null
}

// 更新列表
const handleAddOrder = async (formData) => {
  try {
    if (isEditMode.value) {
      await updateOrder(formData.id, formData)
    } else {
      await createOrder(formData)
    }
    searchKeyword.value = ''
    currentPage.value = 1
    await fetchData()
    isShow.value = false
  } catch (error) {
    console.error('保存订单失败:', error)
    alert('保存失败，请重试')
  }
}

// 编辑订单
const handleEdit = async (id) => {
  try {
    const order = orders.value.find(o => o.id === id)
    if (order) {
      isEditMode.value = true
      editData.value = { ...order }
      isShow.value = true
    }
  } catch (error) {
    console.error('编辑失败:', error)
  }
}

// 从详情模态框编辑订单
const handleEditFromDetail = (id) => {
  handleEdit(id)
}

// 查看订单详情
const handleView = (id) => {
  const order = orders.value.find(o => o.id === id)
  if (order) {
    currentOrder.value = order
    showDetailModal.value = true
  }
}

// 订单状态切换逻辑
const handleToggleStatus = async (id, currentStatus) => {
  try {
    let newStatus = currentStatus
    let action = ''

    // 根据当前状态决定下一个状态
    switch (currentStatus) {
      case 'pending':
        newStatus = 'paid'
        action = '标记已支付'
        break
      case 'paid':
        newStatus = 'shipped'
        action = '标记已发货'
        break
      case 'shipped':
        newStatus = 'completed'
        action = '标记已完成'
        break
      case 'completed':
      case 'cancelled':
        // 已完成或已取消的订单不能再切换状态
        alert('该订单状态不能再修改')
        return
      default:
        alert('未知的订单状态')
        return
    }

    confirmModal.value = {
      visible: true,
      title: `确认${action}`,
      message: `确定要${action}这个订单吗？`,
      type: 'primary',
      confirmText: action,
      onConfirm: async () => {
        try {
          await updateOrderStatus(id, newStatus)
          await fetchData()
        } catch (error) {
          console.error('状态切换失败:', error)
          alert('状态切换失败，请重试')
        }
      }
    }
  } catch (error) {
    console.error('状态切换失败:', error)
    alert('状态切换失败，请重试')
  }
}

// 统一处理批量操作
// eslint-disable-next-line no-unused-vars
const handleBatchAction = (actionKey, params) => {
  switch (actionKey) {
    case 'delete':
      handleBatchDelete()
      break
    case 'paid':
      handleBatchStatus('paid', { paid: '标记已支付' })
      break
    case 'shipped':
      handleBatchStatus('shipped', { shipped: '标记已发货' })
      break
    case 'completed':
      handleBatchStatus('completed', { completed: '标记已完成' })
      break
  }
}
</script>

<style lang="scss" scoped>
// 页面容器
.orders-page {
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
    overflow: visible;
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
