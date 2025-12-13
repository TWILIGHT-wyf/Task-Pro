<template>
  <div class="reviews-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">评论管理</h1>
        <div class="subtitle">评论管理 — 评论列表</div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showAddModal">
          <el-icon><Plus /></el-icon> 添加评论
        </el-button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <SearchBar placeholder="搜索商品名称、客户姓名或评论内容..." @search="handleSearch" />

    <!-- 筛选排序 -->
    <CustomFilter
      :filter-configs="reviewFilterConfigs"
      :sort-configs="reviewSortConfigs"
      @filter="handleFilter"
      @sort="handleSort"
      ref="reviewFilterRef"
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

    <!-- 评论列表 -->
    <div class="table-card card-white" ref="tableCardRef">
      <CustomTable
        :data="reviews"
        :selected-ids="selectedIds"
        :headers="reviewHeaders"
        :status-text-map="{ pending: '待审核', approved: '已通过', rejected: '已拒绝' }"
        :loading="loading"
        @selection-change="handleSelectionChange"
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
        :pageSize="pageSize"
        :total="total"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 添加/编辑评论模态框 -->
    <AddModal
      v-model:visible="showModal"
      title="评论"
      icon=""
      :fields="reviewFields"
      :is-edit-mode="isEditMode"
      :edit-data="editData"
      @submit="handleSubmitReview"
    />

    <!-- 评论详情模态框 -->
    <DetailModal
      v-model:visible="showDetailModal"
      :data="currentReview"
      title="评论详情"
      :sections="reviewDetailSections"
      :images="currentReview?.images || []"
      @edit="handleEditFromDetail"
    />

    <!-- 确认模态框 -->
    <ConfirmModal
      v-model:visible="confirmModal.visible"
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
import { createReview, updateReview } from '@/api/reviews'
import { ref, onMounted } from 'vue'
import { useResponsivePageSize } from '@/composables/useResponsivePageSize'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 初始化
onMounted(async () => {
  computeResponsivePageSize()
  await fetchData()
})

// 定义批量操作配置
const batchActions = [
  { key: 'delete', label: '批量删除', class: 'btn-base btn-danger-outline btn-small' },
  { key: 'approve', label: '批量通过', class: 'btn-base btn-success-outline btn-small' },
  { key: 'reject', label: '批量拒绝', class: 'btn-base btn-warning-outline btn-small' },
  { key: 'pending', label: '设为待审核', class: 'btn-base btn-secondary-outline btn-small' }
]

const {
  currentPage,
  pageSize,
  total,
  loading,
  selectedIds,
  data: reviews,
  confirmModal,
  fetchData,
  handleSearch,
  handleFilter,
  handleSort,
  handleDelete,
  handleBatchDelete,
  handleBatchStatus,
  handleToggleStatus,
  handleImport,
  handleExport,
  handleConfirm,
  handleCancel
} = useTableOperations('/api/reviews', {
  exportFilename: 'reviews'
})

// 模态框状态
const showModal = ref(false)
const isEditMode = ref(false)
const editData = ref(null)
const showDetailModal = ref(false)
const currentReview = ref(null)

// 响应式每页数量：根据表格容器高度计算
const tableCardRef = ref(null)
const { computeResponsivePageSize } = useResponsivePageSize({
  pageSizeRef: pageSize,
  containerRef: tableCardRef,
  onChange: async () => {
    await fetchData()
  }
})

// 评论表单字段配置
const reviewFields = ref([
  {
    key: 'productName',
    label: '商品名称',
    type: 'text',
    required: true,
    placeholder: '请输入商品名称',
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
    key: 'rating',
    label: '评分',
    type: 'select',
    required: true,
    options: [
      { value: null, label: '请选择评分' },
      { value: 5, label: '⭐⭐⭐⭐⭐ 非常满意' },
      { value: 4, label: '⭐⭐⭐⭐ 满意' },
      { value: 3, label: '⭐⭐⭐ 一般' },
      { value: 2, label: '⭐⭐ 不满意' },
      { value: 1, label: '⭐ 非常不满意' }
    ],
    default: null
  },
  {
    key: 'content',
    label: '评论内容',
    type: 'textarea',
    required: true,
    placeholder: '请输入评论内容',
    default: '',
    rows: 4
  },
  {
    key: 'images',
    label: '评论图片',
    type: 'text',
    required: false,
    placeholder: '请输入图片URL，多个用逗号分隔',
    default: ''
  },
  {
    key: 'status',
    label: '审核状态',
    type: 'radio',
    required: true,
    options: [
      { value: 'pending', label: '⏳ 待审核' },
      { value: 'approved', label: '已通过' },
      { value: 'rejected', label: '已拒绝' }
    ],
    default: 'pending'
  }
])

// 评论详情配置
const reviewDetailSections = ref([
  {
    title: '基本信息',
    fields: [
      { key: 'productName', label: '商品名称', type: 'text' },
      { key: 'customerName', label: '客户姓名', type: 'text' },
      { key: 'rating', label: '评分', type: 'rating' },
      { key: 'status', label: '审核状态', type: 'status' }
    ]
  },
  {
    title: '评论内容',
    fields: [
      { key: 'content', label: '评论内容', type: 'text' },
      { key: 'helpful', label: '有用数', type: 'text' }
    ]
  },
  {
    title: '回复信息',
    fields: [
      { key: 'reply.content', label: '商家回复', type: 'text' },
      { key: 'reply.time', label: '回复时间', type: 'date' },
      { key: 'reply.replier', label: '回复人', type: 'text' }
    ]
  },
  {
    title: '时间信息',
    fields: [
      { key: 'createdAt', label: '创建时间', type: 'date' },
      { key: 'updatedAt', label: '更新时间', type: 'date' }
    ]
  }
])

// 评论表格列配置
const reviewHeaders = ref([
  { key: 'id', label: 'ID', type: 'text' },
  { key: 'productName', label: '商品名称', type: 'text' },
  { key: 'customerName', label: '客户姓名', type: 'text' },
  { key: 'rating', label: '评分', type: 'rating' },
  { key: 'content', label: '评论内容', type: 'text' },
  { key: 'status', label: '状态', type: 'status' },
  { key: 'helpful', label: '有用数', type: 'text' },
  { key: 'createdAt', label: '创建时间', type: 'date' }
])

// 评论筛选配置
const reviewFilterConfigs = ref([
  {
    key: 'status',
    label: '状态筛选',
    type: 'select',
    placeholder: '全部状态',
    options: [
      { value: '', label: '全部状态' },
      { value: 'pending', label: '待审核' },
      { value: 'approved', label: '已通过' },
      { value: 'rejected', label: '已拒绝' }
    ]
  },
  {
    key: 'rating',
    label: '评分筛选',
    type: 'select',
    placeholder: '全部评分',
    options: [
      { value: '', label: '全部评分' },
      { value: '5', label: '⭐⭐⭐⭐⭐ 5星' },
      { value: '4', label: '⭐⭐⭐⭐ 4星' },
      { value: '3', label: '⭐⭐⭐ 3星' },
      { value: '2', label: '⭐⭐ 2星' },
      { value: '1', label: '⭐ 1星' }
    ]
  }
])

// 评论排序配置
const reviewSortConfigs = ref([
  { value: 'createdAt', label: '创建时间' },
  { value: 'updatedAt', label: '更新时间' },
  { value: 'rating', label: '评分' },
  { value: 'helpful', label: '有用数' }
])

// 显示添加模态框
const showAddModal = () => {
  isEditMode.value = false
  editData.value = null
  showModal.value = true
}

// 编辑评论
const handleEdit = (id) => {
  const review = reviews.value.find(r => r.id === id)
  if (review) {
    isEditMode.value = true
    editData.value = {
      ...review,
      images: review.images ? review.images.join(',') : ''
    }
    showModal.value = true
  }
}

// 查看评论详情
const handleView = (id) => {
  const review = reviews.value.find(r => r.id === id)
  if (review) {
    currentReview.value = review
    showDetailModal.value = true
  }
}

// 从详情模态框编辑评论
const handleEditFromDetail = (id) => {
  handleEdit(id)
}

// 提交评论（添加/编辑）
const handleSubmitReview = async (formData) => {
  try {
    // 处理表单数据
    const processedForm = {
      ...formData,
      images: formData.images ? formData.images.split(',').map(url => url.trim()).filter(url => url) : [],
      rating: Number(formData.rating),
      helpful: formData.helpful || 0
    }

    if (isEditMode.value) {
      await updateReview(processedForm.id, processedForm)
      ElMessage.success('更新评论成功')
    } else {
      await createReview(processedForm)
      ElMessage.success('添加评论成功')
    }
    showModal.value = false
    await fetchData()
  } catch (error) {
    console.error('保存评论失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 统一处理批量操作
// eslint-disable-next-line no-unused-vars
const handleBatchAction = (actionKey, params) => {
  switch (actionKey) {
    case 'delete':
      handleBatchDelete()
      break
    case 'approve':
      handleBatchStatus('approved')
      break
    case 'reject':
      handleBatchStatus('rejected')
      break
    case 'pending':
      handleBatchStatus('pending')
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

// 表格选择变化处理
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}
</script>

<style lang="scss" scoped>
.reviews-page {
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
