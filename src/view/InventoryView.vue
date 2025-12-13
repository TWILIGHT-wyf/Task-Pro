<template>
  <div class="inventory-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">库存管理</h1>
        <div class="subtitle">库存管理 — 库存列表</div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showStockInModal">
          <el-icon><Download /></el-icon> 入库
        </el-button>
        <el-button type="danger" @click="showStockOutModal">
          <el-icon><Upload /></el-icon> 出库
        </el-button>
      </div>
    </header>

    <!-- 库存统计卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card card-white">
          <div class="stat-icon"><el-icon><Box /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ totalProducts }}</div>
            <div class="stat-label">总商品数</div>
          </div>
        </div>
        <div class="stat-card card-white">
          <div class="stat-icon"><el-icon><Warning /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value warning">{{ lowStockCount }}</div>
            <div class="stat-label">低库存商品</div>
          </div>
        </div>
        <div class="stat-card card-white">
          <div class="stat-icon"><el-icon><Coin /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ (totalValue || 0).toFixed(2) }}</div>
            <div class="stat-label">库存总价值</div>
          </div>
        </div>
        <div class="stat-card card-white">
          <div class="stat-icon"><el-icon><Refresh /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ totalStock }}</div>
            <div class="stat-label">总库存量</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <SearchBar placeholder="搜索商品名称、SKU或供应商..." @search="handleSearch" />

    <!-- 筛选排序 -->
    <CustomFilter
      :filter-configs="inventoryFilterConfigs"
      :sort-configs="inventorySortConfigs"
      @filter="handleFilter"
      @sort="handleSort"
      ref="inventoryFilterRef"
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

    <!-- 库存列表 -->
  <div class="table-card card-white" ref="tableCardRef">
      <CustomTable
        :data="inventory"
        :selected-ids="selectedIds"
        :headers="inventoryHeaders"
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

  <!-- 入库模态框 -->
  <AddModal
    v-model:visible="stockInModal.visible"
    title="商品入库"
    icon=""
    :fields="stockInFields"
    :is-edit-mode="false"
    :edit-data="null"
    @submit="handleStockIn"
  />

  <!-- 出库模态框 -->
  <AddModal
    v-model:visible="stockOutModal.visible"
    title="商品出库"
    icon=""
    :fields="stockOutFields"
    :is-edit-mode="false"
    :edit-data="null"
    @submit="handleStockOut"
  />

  <!-- 库存调整模态框 -->
  <AddModal
    v-model:visible="adjustModal.visible"
    title="库存调整"
    icon=""
    :fields="adjustFields"
    :is-edit-mode="!!adjustModal.editData"
    :edit-data="adjustModal.editData"
    @submit="handleStockAdjust"
  />

  <!-- 批量库存调整模态框 -->
  <AddModal
    v-model:visible="batchAdjustModal.visible"
    title="批量库存调整"
    icon=""
    :fields="batchAdjustFields"
    :is-edit-mode="false"
    :edit-data="batchAdjustModal.adjustData"
    @submit="handleBatchAdjustSubmit"
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

  <!-- 库存详情模态框 -->
  <DetailModal
    v-model:visible="showDetailModal"
    :data="currentInventory"
    title="库存详情"
    :sections="inventoryDetailSections"
    @edit="handleEditFromDetail"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Upload, Box, Warning, Coin, Refresh } from '@element-plus/icons-vue'
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

// 使用通用表格操作函数
const {
  currentPage,
  pageSize,
  total,
  loading,
  selectedIds,
  data: inventory,
  fetchData,
  handleSearch,
  handleFilter,
  handleSort,
  handleDelete,
  handleBatchDelete,
  confirmModal,
  handleConfirm,
  handleCancel,
  handleImport: tableHandleImport,
  handleExport: tableHandleExport,
  stockIn,
  stockOut,
  adjustStock,
  batchAdjustStock,
  getStats
} = useTableOperations('/api/inventory', {
  pageSize: 10,
  exportFilename: 'inventory'
})

// 统计数据
const stats = ref({
  totalProducts: 0,
  lowStockCount: 0,
  totalStock: 0,
  totalValue: 0
})

// 定义批量操作配置
const batchActions = [
  { key: 'delete', label: '批量删除', class: 'btn-base btn-danger-outline btn-small' },
  { key: 'adjust', label: '批量调整', class: 'btn-base btn-success-outline btn-small' }
]

const stockInModal = ref({ visible: false })
const stockOutModal = ref({ visible: false })
const adjustModal = ref({ visible: false, editData: null })
const batchAdjustModal = ref({ visible: false, adjustData: null })


function ensureModalState(modalRef, defaultValue) {
  if (!modalRef.value || typeof modalRef.value !== 'object') {
    modalRef.value = { ...defaultValue }
  }
}

onMounted(() => {
  ensureModalState(stockInModal, { visible: false })
  ensureModalState(stockOutModal, { visible: false })
  ensureModalState(adjustModal, { visible: false, editData: null })
  ensureModalState(batchAdjustModal, { visible: false, adjustData: null })
})

// 表单字段配置
const stockInFields = [
  { key: 'productId', label: '商品ID', type: 'select', required: true, options: [] },
  { key: 'quantity', label: '入库数量', type: 'number', required: true, min: 1 },
  { key: 'unitCost', label: '单价', type: 'number', required: true, min: 0, step: 0.01 },
  { key: 'supplier', label: '供应商', type: 'text', required: true },
  { key: 'batchNumber', label: '批次号', type: 'text' },
  { key: 'expiryDate', label: '到期日期', type: 'date' },
  { key: 'notes', label: '备注', type: 'textarea' }
]

const stockOutFields = [
  { key: 'productId', label: '商品ID', type: 'select', required: true, options: [] },
  { key: 'quantity', label: '出库数量', type: 'number', required: true, min: 1 },
  { key: 'reason', label: '出库原因', type: 'select', required: true, options: [
    { value: 'sale', label: '销售出库' },
    { value: 'damage', label: '损耗出库' },
    { value: 'return', label: '退货出库' },
    { value: 'transfer', label: '调拨出库' },
    { value: 'other', label: '其他' }
  ]},
  { key: 'notes', label: '备注', type: 'textarea' }
]

const adjustFields = [
  { key: 'productName', label: '商品名称', type: 'text', readonly: true },
  { key: 'currentStock', label: '当前库存', type: 'number', readonly: true },
  { key: 'newStock', label: '调整后库存', type: 'number', required: true, min: 0 },
  { key: 'reason', label: '调整原因', type: 'select', required: true, options: [
    { value: 'inventory_check', label: '盘点调整' },
    { value: 'damage', label: '损耗调整' },
    { value: 'return', label: '退货调整' },
    { value: 'correction', label: '数据修正' },
    { value: 'other', label: '其他' }
  ]},
  { key: 'notes', label: '备注', type: 'textarea' }
]

const batchAdjustFields = [
  { key: 'selectedCount', label: '选中商品数', type: 'text', readonly: true },
  { key: 'adjustType', label: '调整类型', type: 'select', required: true, options: [
    { value: 'fixed', label: '固定数量调整' },
    { value: 'percentage', label: '百分比调整' }
  ]},
  { key: 'adjustValue', label: '调整值', type: 'number', required: true, step: 'any',
    placeholder: '固定数量调整输入正负数，百分比调整输入百分比' },
  { key: 'reason', label: '调整原因', type: 'select', required: true, options: [
    { value: 'inventory_check', label: '盘点调整' },
    { value: 'damage', label: '损耗调整' },
    { value: 'return', label: '退货调整' },
    { value: 'correction', label: '数据修正' },
    { value: 'promotion', label: '促销调整' },
    { value: 'other', label: '其他' }
  ]},
  { key: 'notes', label: '备注', type: 'textarea' }
]

// 表格头部配置
const inventoryHeaders = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'productName', label: '商品名称', width: '200px' },
  { key: 'sku', label: 'SKU', width: '120px' },
  { key: 'category', label: '分类', width: '100px' },
  { key: 'currentStock', label: '当前库存', width: '100px', align: 'center' },
  { key: 'minStock', label: '最低库存', width: '100px', align: 'center' },
  { key: 'maxStock', label: '最高库存', width: '100px', align: 'center' },
  { key: 'unitCost', label: '单价', width: '100px', align: 'right' },
  { key: 'totalValue', label: '总价值', width: '120px', align: 'right' },
  { key: 'status', label: '状态', width: '100px', align: 'center' },
  { key: 'lastUpdated', label: '最后更新', width: '150px' },
  { key: 'actions', label: '操作', width: '150px', align: 'center' }
]

// 库存详情配置
const inventoryDetailSections = ref([
  {
    title: '商品信息',
    fields: [
      { key: 'productName', label: '商品名称', type: 'text' },
      { key: 'sku', label: 'SKU', type: 'text' },
      { key: 'category', label: '分类', type: 'text', formatValue: (value) => {
        const categoryMap = {
          'electronics': '电子产品',
          'clothing': '服装',
          'food': '食品',
          'books': '图书'
        }
        return categoryMap[value] || value
      }}
    ]
  },
  {
    title: '库存信息',
    fields: [
      { key: 'currentStock', label: '当前库存', type: 'text' },
      { key: 'minStock', label: '最低库存', type: 'text' },
      { key: 'maxStock', label: '最高库存', type: 'text' },
      { key: 'status', label: '状态', type: 'status', formatValue: (value) => {
        const statusMap = {
          'normal': '正常',
          'low': '低库存',
          'out': '缺货',
          'excess': '库存过多'
        }
        return statusMap[value] || value
      }}
    ]
  },
  {
    title: '价格信息',
    fields: [
      { key: 'unitCost', label: '单价', type: 'currency' },
      { key: 'totalValue', label: '总价值', type: 'currency' }
    ]
  },
  {
    title: '其他信息',
    fields: [
      { key: 'supplier', label: '供应商', type: 'text' },
      { key: 'location', label: '存放位置', type: 'text' },
      { key: 'lastUpdated', label: '最后更新', type: 'date' }
    ]
  }
])

// 筛选配置
const inventoryFilterConfigs = [
  {
    key: 'category',
    label: '商品分类',
    type: 'select',
    options: [
      { value: '', label: '全部' },
      { value: 'electronics', label: '电子产品' },
      { value: 'clothing', label: '服装' },
      { value: 'food', label: '食品' },
      { value: 'books', label: '图书' }
    ]
  },
  {
    key: 'status',
    label: '库存状态',
    type: 'select',
    options: [
      { value: '', label: '全部' },
      { value: 'normal', label: '正常' },
      { value: 'low', label: '低库存' },
      { value: 'out', label: '缺货' },
      { value: 'excess', label: '库存过多' }
    ]
  }
]

// 排序配置
const inventorySortConfigs = [
  { value: 'productName', label: '商品名称' },
  { value: 'currentStock', label: '当前库存' },
  { value: 'unitCost', label: '单价' },
  { value: 'totalValue', label: '总价值' },
  { value: 'lastUpdated', label: '最后更新' }
]

// 查看详情状态
const showDetailModal = ref(false)
const currentInventory = ref(null)

// 计算属性
const totalProducts = computed(() => stats.value.totalProducts)
const lowStockCount = computed(() => stats.value.lowStockCount)
const totalStock = computed(() => stats.value.totalStock)
const totalValue = computed(() => stats.value.totalValue)

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
    const response = await getStats()
    stats.value = response.data
  } catch {
    // 静默处理统计数据加载失败
  }
}

const handleEdit = (id) => {
  const item = inventory.value.find(inv => inv.id === id)
  if (item) {
    adjustModal.value.editData = item
    adjustModal.value.visible = true
  }
}

// 从详情模态框编辑库存
const handleEditFromDetail = (id) => {
  handleEdit(id)
}

const handleView = (id) => {
  const item = inventory.value.find(inv => inv.id === id)
  if (item) {
    currentInventory.value = item
    showDetailModal.value = true
  }
}

const handleCloseDetailModal = () => {
  showDetailModal.value = false
  currentInventory.value = null
}

const handleCloseAdjustModal = () => {
  adjustModal.value.visible = false
  adjustModal.value.editData = null
}

const handleBatchAdjust = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要调整的商品')
    return
  }

  // 准备批量调整数据
  const selectedItems = selectedIds.value.map(id =>
    inventory.value.find(inv => inv.id === id)
  ).filter(item => item)

  batchAdjustModal.value.adjustData = {
    selectedItems,
    adjustType: 'fixed',
    adjustValue: 0,
    reason: 'batch_adjustment'
  }
  batchAdjustModal.value.visible = true
}

const showStockInModal = () => {
  stockInModal.value.visible = true
}

const showStockOutModal = () => {
  stockOutModal.value.visible = true
}

const handleStockIn = async (data) => {
  try {
    await stockIn(data)
    ElMessage.success('入库成功')
    stockInModal.value.visible = false
    await fetchData()
  } catch {
    ElMessage.error('入库失败')
  }
}

const handleStockOut = async (data) => {
  try {
    await stockOut(data)
    ElMessage.success('出库成功')
    stockOutModal.value.visible = false
    await fetchData()
  } catch {
    ElMessage.error('出库失败')
  }
}

const handleBatchAdjustSubmit = async (data) => {
  try {
    const { adjustType, adjustValue, reason, notes } = data
    const adjustments = batchAdjustModal.value.adjustData.selectedItems.map(item => {
      let newStock = item.currentStock

      if (adjustType === 'fixed') {
        newStock = Math.max(0, item.currentStock + adjustValue)
      } else if (adjustType === 'percentage') {
        newStock = Math.max(0, Math.round(item.currentStock * (1 + adjustValue / 100)))
      }

      return {
        productId: item.id,
        currentStock: item.currentStock,
        newStock,
        reason,
        notes: notes || '批量库存调整'
      }
    })

    await batchAdjustStock(adjustments)
    ElMessage.success('批量调整成功')
    batchAdjustModal.value.visible = false
    selectedIds.value = []
    await fetchData()
    await loadStats()
  } catch {
    ElMessage.error('批量调整失败')
  }
}

const handleStockAdjust = async (data) => {
  try {
    const { newStock, reason, notes } = data
    await adjustStock({
      productId: adjustModal.value.editData.id,
      currentStock: adjustModal.value.editData.currentStock,
      newStock,
      reason,
      notes: notes || '库存调整'
    })
    ElMessage.success('库存调整成功')
    adjustModal.value.visible = false
    adjustModal.value.editData = null
    await fetchData()
    await loadStats()
  } catch {
    ElMessage.error('库存调整失败')
  }
}

const handleImport = async (importData) => {
  try {

    const processItemCallback = (item) => {
      return {
        productName: item.productName || item.name,
        sku: item.sku,
        category: item.category,
        currentStock: parseInt(item.currentStock) || 0,
        minStock: parseInt(item.minStock) || 10,
        maxStock: parseInt(item.maxStock) || 100,
        unitCost: parseFloat(item.unitCost) || 0,
        supplier: item.supplier,
        location: item.location
      }
    }

    await tableHandleImport(importData, processItemCallback)
    ElMessage.success('导入成功')
    await loadStats()
  } catch {
    ElMessage.error('导入失败，请检查数据格式')
  }
}

const handleExport = async (format) => {
  try {

    const processExportDataCallback = (item) => {
      return {
        id: item.id,
        productName: item.productName,
        sku: item.sku,
        category: item.category,
        currentStock: item.currentStock,
        minStock: item.minStock,
        maxStock: item.maxStock,
        unitCost: item.unitCost,
        totalValue: item.totalValue,
        status: item.status,
        supplier: item.supplier,
        lastUpdated: item.lastUpdated,
        location: item.location
      }
    }

    await tableHandleExport(format, processExportDataCallback)
    ElMessage.success('导出成功')
  } catch {
    ElMessage.error('导出失败')
  }
}

// 统一处理批量操作
// eslint-disable-next-line no-unused-vars
const handleBatchAction = (actionKey, params) => {
  switch (actionKey) {
    case 'delete':
      handleBatchDelete(() => loadStats())
      break
    case 'adjust':
      handleBatchAdjust()
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
.inventory-page {
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
  overflow: hidden;
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
  .inventory-page {
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
