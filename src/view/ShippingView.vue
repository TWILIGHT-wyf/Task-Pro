<template>
  <div class="shipping-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">配送管理</h1>
        <div class="subtitle">配送管理 — 配送列表</div>
      </div>
      <div class="header-actions">
        <button class="btn-base btn-primary" @click="showAddModal">
          <span>➕</span> 添加配送
        </button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <SearchBar placeholder="搜索订单号、快递单号、收件人姓名或电话..." @search="handleSearch" />

    <!-- 筛选排序 -->
    <CustomFilter
      :filter-configs="shippingFilterConfigs"
      :sort-configs="shippingSortConfigs"
      @filter="handleFilter"
      @sort="handleSort"
      ref="shippingFilterRef"
    />

    <!-- 操作栏 -->
    <div class="action-bar card-white">
      <BatchActions
        :actions="batchActions"
        @action="handleBatchAction"
      />
      <div class="action-right">
        <ImportExport @import="handleImport" @export="handleExport" />
      </div>
    </div>

    <!-- 配送列表 -->
    <div class="table-card card-white" ref="tableCardRef">
      <CustomTable
        :data="shippings"
        :selected-ids="selectedIds"
        :headers="shippingHeaders"
        :status-text-map="{ pending: '待发货', processing: '处理中', shipped: '已发货', delivered: '已送达', cancelled: '已取消' }"
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

    <!-- 添加/编辑配送模态框 -->
    <AddModal
      :visible="showModal"
      title="配送"
      icon="🚚"
      :fields="shippingFields"
      :is-edit-mode="isEditMode"
      :edit-data="editData"
      @close="showModal = false"
      @submit="handleSubmitShipping"
    />

    <!-- 配送详情模态框 -->
    <DetailModal
      :visible="showDetailModal"
      :data="currentShipping"
      title="配送详情"
      :sections="shippingDetailSections"
      @close="showDetailModal = false"
      @edit="handleEditFromDetail"
    />

    <!-- 确认模态框 -->
    <ConfirmModal
      :visible="confirmModal.visible"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :confirmText="confirmModal.confirmText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import AddModal from '@/components/AddModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import CustomTable from '@/components/CustomTable.vue'
import ImportExport from '@/components/ImportExport.vue'
import DetailModal from '@/components/DetailModal.vue'
import CustomFilter from '@/components/CustomFilter.vue'
import SearchBar from '@/components/SearchBar.vue'
import BatchActions from '@/components/BatchActions.vue'
import { useTableOperations } from '@/composables/useTableOperations'
import { createShipping, updateShipping } from '@/api/shippings'
import { ref, onMounted } from 'vue'
import { useResponsivePageSize } from '@/composables/useResponsivePageSize'

// 初始化
onMounted(async () => {
  computeResponsivePageSize()
  await fetchData()
})

// 定义批量操作配置
const batchActions = [
  { key: 'delete', label: '批量删除', class: 'btn-base btn-danger-outline btn-small' },
  { key: 'shipped', label: '批量发货', class: 'btn-base btn-success-outline btn-small' },
  { key: 'delivered', label: '批量送达', class: 'btn-base btn-primary-outline btn-small' },
  { key: 'cancelled', label: '批量取消', class: 'btn-base btn-warning-outline btn-small' }
]

const {
  currentPage,
  pageSize,
  totalPages,
  selectedIds,
  data: shippings,
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
} = useTableOperations('/api/shippings', {
  exportFilename: 'shippings'
})

// 模态框状态
const showModal = ref(false)
const isEditMode = ref(false)
const editData = ref(null)
const showDetailModal = ref(false)
const currentShipping = ref(null)

// 响应式每页数量
const tableCardRef = ref(null)
const { computeResponsivePageSize } = useResponsivePageSize({
  pageSizeRef: pageSize,
  containerRef: tableCardRef,
  onChange: async () => {
    await fetchData()
  }
})

// 配送表单字段配置
const shippingFields = ref([
  {
    key: 'orderNumber',
    label: '订单号',
    type: 'text',
    required: true,
    placeholder: '请输入订单号',
    default: ''
  },
  {
    key: 'trackingNumber',
    label: '快递单号',
    type: 'text',
    required: true,
    placeholder: '请输入快递单号',
    default: ''
  },
  {
    key: 'shippingMethod',
    label: '配送方式',
    type: 'select',
    required: true,
    options: [
      { value: null, label: '请选择配送方式' },
      { value: '顺丰快递', label: '顺丰快递' },
      { value: '圆通快递', label: '圆通快递' },
      { value: '中通快递', label: '中通快递' },
      { value: '申通快递', label: '申通快递' },
      { value: '韵达快递', label: '韵达快递' },
      { value: 'EMS', label: 'EMS' },
      { value: '京东物流', label: '京东物流' }
    ],
    default: null
  },
  {
    key: 'recipientName',
    label: '收件人姓名',
    type: 'text',
    required: true,
    placeholder: '请输入收件人姓名',
    default: ''
  },
  {
    key: 'recipientPhone',
    label: '收件人电话',
    type: 'text',
    required: true,
    placeholder: '请输入收件人电话',
    default: ''
  },
  {
    key: 'recipientAddress',
    label: '收件地址',
    type: 'textarea',
    required: true,
    placeholder: '请输入收件地址',
    default: '',
    rows: 2
  },
  {
    key: 'weight',
    label: '重量(kg)',
    type: 'number',
    required: true,
    placeholder: '请输入重量',
    default: '',
    min: 0,
    step: 0.1
  },
  {
    key: 'shippingFee',
    label: '运费',
    type: 'number',
    required: true,
    placeholder: '请输入运费',
    default: '',
    min: 0,
    step: 0.01
  },
  {
    key: 'estimatedDelivery',
    label: '预计送达日期',
    type: 'date',
    required: false,
    placeholder: '请选择预计送达日期',
    default: ''
  },
  {
    key: 'status',
    label: '配送状态',
    type: 'radio',
    required: true,
    options: [
      { value: 'pending', label: '⏳ 待发货' },
      { value: 'processing', label: '🔄 处理中' },
      { value: 'shipped', label: '🚚 已发货' },
      { value: 'delivered', label: '✓ 已送达' },
      { value: 'cancelled', label: '✗ 已取消' }
    ],
    default: 'pending'
  },
  {
    key: 'remarks',
    label: '备注',
    type: 'textarea',
    required: false,
    placeholder: '请输入备注信息',
    default: '',
    rows: 2
  }
])

// 配送详情配置
const shippingDetailSections = ref([
  {
    title: '订单信息',
    fields: [
      { key: 'orderNumber', label: '订单号', type: 'text' },
      { key: 'trackingNumber', label: '快递单号', type: 'text' },
      { key: 'shippingMethod', label: '配送方式', type: 'text' },
      { key: 'status', label: '配送状态', type: 'status' }
    ]
  },
  {
    title: '收件人信息',
    fields: [
      { key: 'recipient.name', label: '收件人姓名', type: 'text' },
      { key: 'recipient.phone', label: '收件人电话', type: 'text' },
      { key: 'recipient.address', label: '收件地址', type: 'text' }
    ]
  },
  {
    title: '发件人信息',
    fields: [
      { key: 'sender.name', label: '发件人姓名', type: 'text' },
      { key: 'sender.phone', label: '发件人电话', type: 'text' },
      { key: 'sender.address', label: '发件地址', type: 'text' }
    ]
  },
  {
    title: '物流信息',
    fields: [
      { key: 'weight', label: '重量', type: 'weight' },
      { key: 'shippingFee', label: '运费', type: 'currency' },
      { key: 'estimatedDelivery', label: '预计送达', type: 'date' },
      { key: 'actualDelivery', label: '实际送达', type: 'date' }
    ]
  },
  {
    title: '其他信息',
    fields: [
      { key: 'remarks', label: '备注', type: 'text' },
      { key: 'createdAt', label: '创建时间', type: 'date' },
      { key: 'updatedAt', label: '更新时间', type: 'date' }
    ]
  }
])

// 配送表格列配置
const shippingHeaders = ref([
  { key: 'id', label: 'ID', type: 'text' },
  { key: 'trackingNumber', label: '快递单号', type: 'text' },
  { key: 'orderNumber', label: '订单号', type: 'text' },
  { key: 'shippingMethod', label: '配送方式', type: 'text' },
  { key: 'recipient.name', label: '收件人', type: 'text' },
  { key: 'recipient.phone', label: '联系电话', type: 'text' },
  { key: 'status', label: '状态', type: 'status' },
  { key: 'estimatedDelivery', label: '预计送达', type: 'date' },
  { key: 'createdAt', label: '创建时间', type: 'date' }
])

// 配送筛选配置
const shippingFilterConfigs = ref([
  {
    key: 'status',
    label: '状态筛选',
    type: 'select',
    placeholder: '全部状态',
    options: [
      { value: '', label: '全部状态' },
      { value: 'pending', label: '待发货' },
      { value: 'processing', label: '处理中' },
      { value: 'shipped', label: '已发货' },
      { value: 'delivered', label: '已送达' },
      { value: 'cancelled', label: '已取消' }
    ]
  },
  {
    key: 'shippingMethod',
    label: '配送方式',
    type: 'select',
    placeholder: '全部方式',
    options: [
      { value: '', label: '全部方式' },
      { value: '顺丰快递', label: '顺丰快递' },
      { value: '圆通快递', label: '圆通快递' },
      { value: '中通快递', label: '中通快递' },
      { value: '申通快递', label: '申通快递' },
      { value: '韵达快递', label: '韵达快递' },
      { value: 'EMS', label: 'EMS' },
      { value: '京东物流', label: '京东物流' }
    ]
  }
])

// 配送排序配置
const shippingSortConfigs = ref([
  { value: 'createdAt', label: '创建时间' },
  { value: 'updatedAt', label: '更新时间' },
  { value: 'estimatedDelivery', label: '预计送达时间' },
  { value: 'shippingFee', label: '运费' }
])

// 显示添加模态框
const showAddModal = () => {
  isEditMode.value = false
  editData.value = null
  showModal.value = true
}

// 编辑配送
const handleEdit = (id) => {
  const shipping = shippings.value.find(s => s.id === id)
  if (shipping) {
    isEditMode.value = true
    editData.value = {
      ...shipping,
      recipientName: shipping.recipient?.name || '',
      recipientPhone: shipping.recipient?.phone || '',
      recipientAddress: shipping.recipient?.address || ''
    }
    showModal.value = true
  }
}

// 查看配送详情
const handleView = (id) => {
  const shipping = shippings.value.find(s => s.id === id)
  if (shipping) {
    currentShipping.value = shipping
    showDetailModal.value = true
  }
}

// 从详情模态框编辑配送
const handleEditFromDetail = (id) => {
  handleEdit(id)
}

// 提交配送（添加/编辑）
const handleSubmitShipping = async (formData) => {
  try {
    const processedForm = {
      ...formData,
      recipient: {
        name: formData.recipientName,
        phone: formData.recipientPhone,
        address: formData.recipientAddress
      },
      weight: Number(formData.weight),
      shippingFee: Number(formData.shippingFee)
    }

    // 删除临时字段
    delete processedForm.recipientName
    delete processedForm.recipientPhone
    delete processedForm.recipientAddress

    if (isEditMode.value) {
      await updateShipping(processedForm.id, processedForm)
    } else {
      await createShipping(processedForm)
    }
    showModal.value = false
    await fetchData()
  } catch (error) {
    console.error('保存配送失败:', error)
    alert('保存失败，请重试')
  }
}

// 统一处理批量操作
// eslint-disable-next-line no-unused-vars
const handleBatchAction = (actionKey, params) => {
  switch (actionKey) {
    case 'delete':
      handleBatchDelete()
      break
    case 'shipped':
      handleBatchStatus('shipped')
      break
    case 'delivered':
      handleBatchStatus('delivered')
      break
    case 'cancelled':
      handleBatchStatus('cancelled')
      break
  }
}
</script>

<style lang="scss" scoped>
.shipping-page {
  display: flex;
  flex-direction: column;
  padding: 18px;
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
  background: #f8f9fa;
}

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

.search-section {
  margin-bottom: 12px;
}

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

.table-card {
  overflow: hidden;
  flex: 1 1 auto;
  min-height: 0;
  overflow: visible;
  padding: 0;
}

.pagination-section {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  padding: 12px;
}
</style>
