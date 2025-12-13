<template>
  <div class="promotions-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">促销管理</h1>
        <div class="subtitle">促销管理 — 促销活动列表</div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showAddModal">
          <el-icon><Plus /></el-icon> 新建促销
        </el-button>
      </div>
    </header>

    <!-- 促销统计卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card card-white">
          <div class="stat-icon"><el-icon><Aim /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ totalPromotions }}</div>
            <div class="stat-label">总促销活动</div>
          </div>
        </div>
        <div class="stat-card card-white">
          <div class="stat-icon"><el-icon><TrendCharts /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ activePromotions }}</div>
            <div class="stat-label">进行中活动</div>
          </div>
        </div>
        <div class="stat-card card-white">
          <div class="stat-icon"><el-icon><Coin /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ totalDiscount.toFixed(2) }}</div>
            <div class="stat-label">累计优惠金额</div>
          </div>
        </div>
        <div class="stat-card card-white">
          <div class="stat-icon"><el-icon><UserFilled /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ totalParticipants }}</div>
            <div class="stat-label">参与人数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <SearchBar placeholder="搜索促销名称、描述或商品..." @search="handleSearch" />

    <!-- 筛选排序 -->
    <CustomFilter
      :filter-configs="promotionFilterConfigs"
      :sort-configs="promotionSortConfigs"
      @filter="handleFilter"
      @sort="handleSort"
      ref="promotionFilterRef"
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

    <!-- 促销列表 -->
  <div class="table-card card-white" ref="tableCardRef">
      <CustomTable
        :data="promotions"
        :selected-ids="selectedIds"
        :headers="promotionHeaders"
        :loading="loading"
        @selection-change="handleSelectionChange"
        @edit="handleEdit"
        @delete="handleDelete"
        @view="handleView"
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

  <!-- 新建/编辑促销模态框 -->
  <AddModal
    v-model:visible="addModal.visible"
    :title="addModal.isEdit ? '编辑促销' : '新建促销'"
    icon=""
    :fields="promotionFields"
    :is-edit-mode="addModal.isEdit"
    :edit-data="addModal.editData"
    @submit="handleSubmitPromotion"
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

  <!-- 促销详情模态框 -->
  <DetailModal
    v-model:visible="showDetailModal"
    :data="currentPromotion"
    title="促销详情"
    :sections="promotionDetailSections"
    @edit="handleEditFromDetail"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Aim, TrendCharts, Coin, UserFilled } from '@element-plus/icons-vue'
import CustomTable from '../components/CustomTable.vue'
import CustomFilter from '../components/CustomFilter.vue'
import CustomPagination from '../components/CustomPagination.vue'
import SearchBar from '../components/SearchBar.vue'
import AddModal from '../components/AddModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import ImportExport from '../components/ImportExport.vue'
import DetailModal from '../components/DetailModal.vue'
import BatchActions from '../components/BatchActions.vue'
import { useTableOperations } from '../composables/useTableOperations'
import { useResponsivePageSize } from '@/composables/useResponsivePageSize'
import {
  getPromotionStats,
  createPromotion,
  updatePromotion,
  batchEnablePromotions,
  batchDisablePromotions,
  exportPromotions
} from '../api/promotions'

// 使用通用表格操作函数
const {
  currentPage,
  pageSize,
  total,
  loading,
  selectedIds,
  data: promotions,
  fetchData,
  handleSearch,
  handleFilter,
  handleSort,
  handleDelete,
  handleBatchDelete,
  confirmModal,
  handleConfirm,
  handleCancel,
  searchKeyword,
  filters
} = useTableOperations('/api/promotions', {
  pageSize: 10,
  exportFilename: 'promotions'
})

// 统计数据
const stats = ref({
  totalPromotions: 0,
  activePromotions: 0,
  totalDiscount: 0,
  totalParticipants: 0
})

// 定义批量操作配置
const batchActions = [
  { key: 'delete', label: '批量删除', class: 'btn-base btn-danger-outline btn-small' },
  { key: 'enable', label: '批量启用', class: 'btn-base btn-success-outline btn-small' },
  { key: 'disable', label: '批量停用', class: 'btn-base btn-secondary-outline btn-small' }
]

// 模态框状态
const addModal = ref({
  visible: false,
  isEdit: false,
  editData: null
})

// 详情模态框状态
const showDetailModal = ref(false)
const currentPromotion = ref(null)

// 表单字段配置
const promotionFields = [
  { key: 'name', label: '促销名称', type: 'text', required: true, placeholder: '请输入促销活动名称' },
  { key: 'description', label: '促销描述', type: 'textarea', required: true, placeholder: '请输入促销活动描述', rows: 3 },
  { key: 'type', label: '促销类型', type: 'select', required: true, options: [
    { value: 'discount', label: '折扣优惠' },
    { value: 'coupon', label: '优惠券' },
    { value: 'buy_one_get_one', label: '买一送一' },
    { value: 'bundle', label: '捆绑销售' },
    { value: 'flash_sale', label: '限时抢购' },
    { value: 'full_reduction', label: '满减优惠' }
  ]},
  { key: 'discountValue', label: '优惠力度', type: 'number', required: true, min: 0, step: 0.01, placeholder: '折扣比例(0-1)或优惠金额' },
  { key: 'startDate', label: '开始时间', type: 'datetime-local', required: true },
  { key: 'endDate', label: '结束时间', type: 'datetime-local', required: true },
  { key: 'targetProducts', label: '适用商品', type: 'text', placeholder: '商品ID或分类，多个用逗号分隔' },
  { key: 'minPurchase', label: '最低购买金额', type: 'number', min: 0, step: 0.01, placeholder: '满减优惠的最低金额' },
  { key: 'maxDiscount', label: '最大优惠金额', type: 'number', min: 0, step: 0.01, placeholder: '折扣优惠的最大金额限制' },
  { key: 'usageLimit', label: '使用限制', type: 'number', min: 1, placeholder: '每人最多使用次数' },
  { key: 'totalLimit', label: '总量限制', type: 'number', min: 1, placeholder: '总使用次数限制' },
  { key: 'status', label: '状态', type: 'select', options: [
    { value: 'active', label: '启用' },
    { value: 'inactive', label: '停用' },
    { value: 'expired', label: '已过期' }
  ], default: 'active' },
  { key: 'priority', label: '优先级', type: 'number', min: 1, max: 100, default: 50, placeholder: '数字越大优先级越高' },
  { key: 'notes', label: '备注', type: 'textarea', placeholder: '其他备注信息' }
]

// 表格头部配置
const promotionHeaders = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: '促销名称', width: '200px' },
  { key: 'type', label: '类型', width: '120px' },
  { key: 'discountValue', label: '优惠力度', width: '100px', align: 'center' },
  { key: 'startDate', label: '开始时间', width: '150px' },
  { key: 'endDate', label: '结束时间', width: '150px' },
  { key: 'status', label: '状态', width: '100px', align: 'center' },
  { key: 'participants', label: '参与人数', width: '100px', align: 'center' },
  { key: 'totalDiscount', label: '累计优惠', width: '120px', align: 'right' },
  { key: 'priority', label: '优先级', width: '80px', align: 'center' },
  { key: 'actions', label: '操作', width: '150px', align: 'center' }
]

// 筛选配置
const promotionFilterConfigs = [
  {
    key: 'type',
    label: '促销类型',
    type: 'select',
    options: [
      { value: '', label: '全部类型' },
      { value: 'discount', label: '折扣优惠' },
      { value: 'coupon', label: '优惠券' },
      { value: 'buy_one_get_one', label: '买一送一' },
      { value: 'bundle', label: '捆绑销售' },
      { value: 'flash_sale', label: '限时抢购' },
      { value: 'full_reduction', label: '满减优惠' }
    ]
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { value: '', label: '全部状态' },
      { value: 'active', label: '启用' },
      { value: 'inactive', label: '停用' },
      { value: 'expired', label: '已过期' }
    ]
  }
]

// 排序配置
const promotionSortConfigs = [
  { value: 'name', label: '促销名称' },
  { value: 'startDate', label: '开始时间' },
  { value: 'endDate', label: '结束时间' },
  { value: 'priority', label: '优先级' },
  { value: 'participants', label: '参与人数' },
  { value: 'totalDiscount', label: '累计优惠' }
]

// 促销详情配置
const promotionDetailSections = ref([
  {
    title: '基本信息',
    fields: [
      { key: 'name', label: '促销名称', type: 'text' },
      { key: 'description', label: '促销描述', type: 'text' },
      { key: 'type', label: '促销类型', type: 'text', formatValue: (value) => {
        const typeMap = {
          'discount': '折扣优惠',
          'coupon': '优惠券',
          'buy_one_get_one': '买一送一',
          'bundle': '捆绑销售',
          'flash_sale': '限时抢购',
          'full_reduction': '满减优惠'
        }
        return typeMap[value] || value
      }},
      { key: 'status', label: '状态', type: 'status', formatValue: (value) => {
        const statusMap = {
          'active': '启用',
          'inactive': '停用',
          'expired': '已过期'
        }
        return statusMap[value] || value
      }}
    ]
  },
  {
    title: '优惠详情',
    fields: [
      { key: 'discountValue', label: '优惠力度', type: 'text' },
      { key: 'minPurchase', label: '最低购买金额', type: 'currency' },
      { key: 'maxDiscount', label: '最大优惠金额', type: 'currency' },
      { key: 'priority', label: '优先级', type: 'text' }
    ]
  },
  {
    title: '时间信息',
    fields: [
      { key: 'startDate', label: '开始时间', type: 'date' },
      { key: 'endDate', label: '结束时间', type: 'date' }
    ]
  },
  {
    title: '使用限制',
    fields: [
      { key: 'usageLimit', label: '每人使用限制', type: 'text' },
      { key: 'totalLimit', label: '总使用限制', type: 'text' },
      { key: 'targetProducts', label: '适用商品', type: 'text' },
      { key: 'participants', label: '参与人数', type: 'text' }
    ]
  },
  {
    title: '统计信息',
    fields: [
      { key: 'totalDiscount', label: '累计优惠金额', type: 'currency' },
      { key: 'notes', label: '备注', type: 'text' }
    ]
  }
])

// 计算属性
const totalPromotions = computed(() => stats.value.totalPromotions)
const activePromotions = computed(() => stats.value.activePromotions)
const totalDiscount = computed(() => stats.value.totalDiscount)
const totalParticipants = computed(() => stats.value.totalParticipants)

// 生命周期
// 响应式每页数量：根据表格容器高度计算
const tableCardRef = ref(null)
const { computeResponsivePageSize } = useResponsivePageSize({
  pageSizeRef: pageSize,
  containerRef: tableCardRef,
  onChange: async () => {
    await fetchData()
    await loadStats()
  }
})

onMounted(async () => {
  computeResponsivePageSize()
  await fetchData()
  await loadStats()
})

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await getPromotionStats()
    const data = response.data
    stats.value = {
      totalPromotions: data.total || 0,
      activePromotions: data.active || 0,
      totalDiscount: data.totalDiscount || 0,
      totalParticipants: data.totalParticipants || 0
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    // 设置默认值
    stats.value = {
      totalPromotions: promotions.value.length,
      activePromotions: promotions.value.filter(p => p.status === 1).length,
      totalDiscount: 0,
      totalParticipants: 0
    }
  }
}

const showAddModal = () => {
  addModal.value = {
    visible: true,
    isEdit: false,
    editData: null
  }
}

const handleEdit = (param) => {
  let promotion
  if (typeof param === 'number' || typeof param === 'string') {
    // 如果是ID，通过ID查找
    promotion = promotions.value.find(p => p.id === param)
  } else {
    // 如果是对象，直接使用
    promotion = param
  }

  if (promotion) {
    addModal.value = {
      visible: true,
      isEdit: true,
      editData: promotion
    }
  }
}

const handleView = (item) => {
  currentPromotion.value = item
  showDetailModal.value = true
}

const handleEditFromDetail = (id) => {
  handleEdit(id)
}

const handleSubmitPromotion = async (formData) => {
  try {
    // 转换数据格式以匹配API期望
    const apiData = {
      ...formData,
      status: formData.status === 'active' ? 1 : 0,
      discountValue: parseFloat(formData.discountValue),
      minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : 0,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 0,
      totalLimit: formData.totalLimit ? parseInt(formData.totalLimit) : 0,
      priority: formData.priority ? parseInt(formData.priority) : 50
    }

    if (addModal.value.isEdit) {
      await updatePromotion(addModal.value.editData.id, apiData)
      ElMessage.success('促销更新成功')
    } else {
      await createPromotion(apiData)
      ElMessage.success('促销创建成功')
    }
    addModal.value.visible = false
    await fetchData()
    await loadStats()
  } catch (error) {
    console.error('保存促销失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

const handleBatchEnable = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要启用的促销活动')
    return
  }

  confirmModal.value = {
    visible: true,
    title: '确认批量启用',
    message: `确定启用选中的 ${selectedIds.value.length} 个促销活动吗？`,
    type: 'primary',
    confirmText: '启用',
    onConfirm: async () => {
      try {
        await batchEnablePromotions(selectedIds.value)
        ElMessage.success('批量启用成功')
        selectedIds.value = []
        await fetchData()
        await loadStats()
      } catch (error) {
        console.error('批量启用失败:', error)
        ElMessage.error('批量启用失败，请重试')
      }
    }
  }
}

const handleBatchDisable = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要停用的促销活动')
    return
  }

  confirmModal.value = {
    visible: true,
    title: '确认批量停用',
    message: `确定停用选中的 ${selectedIds.value.length} 个促销活动吗？`,
    type: 'danger',
    confirmText: '停用',
    onConfirm: async () => {
      try {
        await batchDisablePromotions(selectedIds.value)
        ElMessage.success('批量停用成功')
        selectedIds.value = []
        await fetchData()
        await loadStats()
      } catch (error) {
        console.error('批量停用失败:', error)
        ElMessage.error('批量停用失败，请重试')
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
const handleBatchAction = (actionKey, params) => {
  switch (actionKey) {
    case 'delete':
      handleBatchDelete()
      break
    case 'enable':
      handleBatchEnable()
      break
    case 'disable':
      handleBatchDisable()
      break
  }
}

const handleImport = async (file) => {
  // 这里应该实现导入逻辑
  // 解析文件并调用API导入数据
  console.log('导入文件:', file)
  ElMessage.info('导入功能开发中')
}

const handleExport = async (format = 'xlsx') => {
  try {
    const response = await exportPromotions({
      keyword: searchKeyword.value,
      type: filters.value.type,
      status: filters.value.status
    })

    // 创建下载链接
    const blob = new Blob([response], {
      type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `promotions.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
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
.promotions-page {
  display: flex;
  flex-direction: column;
  padding: 18px;
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
  background: #f5f7fa;
  overflow: hidden;
}

// 页面头部
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .header-left {
    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text);
      margin: 0 0 4px 0;
    }

    .subtitle {
      font-size: 14px;
      color: var(--muted);
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

// 统计卡片
.stats-section {
  margin-bottom: 24px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;

    .stat-icon {
      font-size: 32px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .stat-content {
      flex: 1;

      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 4px;

        &.warning {
          color: var(--danger);
        }
      }

      .stat-label {
        font-size: 14px;
        color: var(--muted);
        font-weight: 500;
      }
    }
  }
}

// 操作栏
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 16px;

  .action-group {
    display: flex;
    gap: 12px;
  }

  .action-right {
    display: flex;
    gap: 12px;
  }
}

// 表格卡片
.table-card {
  flex: 1 1 auto;
  min-height: 0;
  margin-bottom: 16px;
  overflow: visible;
}

// 分页区域
.pagination-section {
  padding: 16px 20px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

// 按钮样式扩展
.btn-small {
  padding: 6px 12px;
  font-size: 13px;
}

// 响应式设计
@media (max-width: 768px) {
  .promotions-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-bar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;

    .action-group,
    .action-right {
      justify-content: center;
    }
  }
}
</style>
