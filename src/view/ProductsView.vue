
<template>
  <div class="products-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">商品管理</h1>
        <div class="subtitle">商品管理 — 商品列表</div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showAddModal">
          <el-icon><Plus /></el-icon>
          添加商品
        </el-button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <SearchBar placeholder="搜索商品名称、品牌或描述..." @search="handleSearch" />

    <!-- 筛选排序 -->
    <CustomFilter
      :filter-configs="productFilterConfigs"
      :sort-configs="productSortConfigs"
      @filter="handleFilter"
      @sort="handleSort"
      ref="productFilterRef"
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

    <!-- 商品列表 - 添加 loading 和 selection-change -->
    <div class="table-card card-white" ref="tableCardRef">
      <CustomTable
        :data="products"
        :selected-ids="selectedIds"
        :headers="productHeaders"
        :loading="loading"
        :categories="allCategories"
        :status-text-map="{ 1: '上架', 0: '下架' }"
        @selection-change="handleSelectionChange"
        @edit="handleEdit"
        @delete="handleDelete"
        @view="handleView"
        @toggle-status="handleToggleStatus"
      />
    </div>

    <!-- 分页 - 添加 total 和 pageSize -->
    <div class="pagination-section card-white">
      <CustomPagination
        :currentPage="currentPage"
        :pageSize="pageSize"
        :total="total"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 添加/编辑商品模态框 -->
    <AddModal
      v-model:visible="showModal"
      title="商品"
      icon=""
      :fields="productFields"
      :is-edit-mode="isEditMode"
      :edit-data="editData"
      @close="showModal = false"
      @submit="handleSubmitProduct"
    />

    <!-- 商品详情模态框 -->
    <DetailModal
      v-model:visible="showDetailModal"
      :data="currentProduct"
      title="商品详情"
      :sections="productDetailSections"
      :images="currentProduct?.images || []"
      @close="showDetailModal = false"
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
import { Plus } from '@element-plus/icons-vue'
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
import { getCategories, createProduct, updateProduct } from '@/api'
import { ref, onMounted, computed } from 'vue'
import { useResponsivePageSize } from '@/composables/useResponsivePageSize'
import { ElMessage } from 'element-plus'

// 数据
const allCategories = ref([])

// 获取所有分类
async function fetchAllCategories() {
  try {
    const res = await getCategories({ page: 1, size: 1000 })
    allCategories.value = res.data.list
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 初始化
onMounted(async () => {
  computeResponsivePageSize()
  await fetchData()
})

// 定义批量操作配置
const batchActions = [
  { key: 'delete', label: '批量删除', class: 'btn-base btn-danger-outline btn-small' },
  { key: 'enable', label: '批量上架', class: 'btn-base btn-success-outline btn-small' },
  { key: 'disable', label: '批量下架', class: 'btn-base btn-secondary-outline btn-small' }
]

const {
  currentPage,
  pageSize,
  total,
  selectedIds,
  loading,
  data: products,
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
} = useTableOperations('/api/products', {
  exportFilename: 'products',
  initCallback: fetchAllCategories
})

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

// 选择变化处理
const handleSelectionChange = (ids) => {
  selectedIds.value = ids
}

// 模态框状态
const showModal = ref(false)
const isEditMode = ref(false)
const editData = ref(null)
const showDetailModal = ref(false)
const currentProduct = ref(null)

// 响应式每页数量：根据表格容器高度计算
const tableCardRef = ref(null)
const { computeResponsivePageSize } = useResponsivePageSize({
  pageSizeRef: pageSize,
  containerRef: tableCardRef,
  onChange: async () => {
    await fetchData()
  }
})

// 商品表单字段配置
const productFields = ref([
  {
    key: 'name',
    label: '商品名称',
    type: 'text',
    required: true,
    placeholder: '请输入商品名称',
    default: ''
  },
  {
    key: 'brand',
    label: '品牌',
    type: 'text',
    required: true,
    placeholder: '请输入品牌名称',
    default: ''
  },
  {
    key: 'description',
    label: '商品描述',
    type: 'textarea',
    required: false,
    placeholder: '请输入商品描述',
    default: '',
    rows: 3
  },
  {
    key: 'categoryId',
    label: '商品分类',
    type: 'select',
    required: true,
    options: computed(() => [
      { value: null, label: '请选择分类' },
      ...(allCategories.value || []).map(category => ({
        value: category.id,
        label: category.name
      }))
    ]),
    default: null
  },
  {
    key: 'images',
    label: '商品图片',
    type: 'url',
    required: true,
    placeholder: '请输入图片URL',
    default: ''
  },
  {
    key: 'price',
    label: '销售价格',
    type: 'number',
    required: true,
    placeholder: '请输入销售价格',
    default: '',
    min: 0,
    step: 0.01
  },
  {
    key: 'originalPrice',
    label: '原价',
    type: 'number',
    required: false,
    placeholder: '请输入原价（可选）',
    default: '',
    min: 0,
    step: 0.01
  },
  {
    key: 'stock',
    label: '库存数量',
    type: 'number',
    required: true,
    placeholder: '请输入库存数量',
    default: '',
    min: 0
  },
  {
    key: 'weight',
    label: '商品重量(g)',
    type: 'number',
    required: true,
    placeholder: '请输入商品重量',
    default: '',
    min: 0,
    step: 0.1
  },
  {
    key: 'status',
    label: '商品状态',
    type: 'radio',
    required: false,
    options: [
      { value: 1, label: '上架' },
      { value: 0, label: '下架' }
    ],
    default: 1
  },
  {
    key: 'sort',
    label: '排序权重',
    type: 'number',
    required: false,
    placeholder: '请输入排序权重',
    default: 0,
    min: 0
  }
])

// 商品详情配置
const productDetailSections = ref([
  {
    title: '基本信息',
    fields: [
      { key: 'name', label: '商品名称', type: 'text' },
      { key: 'brand', label: '品牌', type: 'text' },
      { key: 'categoryId', label: '商品分类', type: 'category', getCategoryName: (id) => {
        const category = allCategories.value.find(cat => cat.id === id)
        return category ? category.name : '未知分类'
      } },
      { key: 'status', label: '商品状态', type: 'status' }
    ]
  },
  {
    title: '价格信息',
    fields: [
      { key: 'price', label: '销售价格', type: 'currency' },
      { key: 'originalPrice', label: '原价', type: 'currency' },
      { key: 'stock', label: '库存数量', type: 'stock' },
      { key: 'weight', label: '商品重量', type: 'weight' }
    ]
  },
  {
    title: '销售数据',
    fields: [
      { key: 'sales', label: '销量', type: 'sales' },
      { key: 'rating', label: '评分', type: 'rating' },
      { key: 'sort', label: '排序权重', type: 'text' }
    ]
  },
  {
    title: '其他信息',
    fields: [
      { key: 'description', label: '商品描述', type: 'text' },
      { key: 'createTime', label: '创建时间', type: 'date' },
      { key: 'updateTime', label: '更新时间', type: 'date' }
    ]
  }
])

// 商品表格列配置
const productHeaders = ref([
  { key: 'id', label: 'ID', type: 'text' },
  { key: 'images', label: '图片', type: 'image' },
  { key: 'name', label: '商品名称', type: 'text' },
  { key: 'brand', label: '品牌', type: 'text' },
  { key: 'price', label: '价格', type: 'price' },
  { key: 'stock', label: '库存', type: 'text' },
  { key: 'status', label: '状态', type: 'status' },
  { key: 'categoryId', label: '分类', type: 'category' },
  { key: 'rating', label: '评分', type: 'rating' },
  { key: 'sales', label: '销量', type: 'text' }
])

// 商品筛选配置
const productFilterConfigs = ref([
  {
    key: 'categoryId',
    label: '分类筛选',
    type: 'select',
    placeholder: '全部分类',
    options: computed(() => [
      { value: '', label: '全部分类' },
      ...(allCategories.value || []).map(category => ({
        value: category.id,
        label: category.name
      }))
    ])
  },
  {
    key: 'status',
    label: '状态筛选',
    type: 'select',
    placeholder: '全部状态',
    options: [
      { value: '1', label: '上架' },
      { value: '0', label: '下架' }
    ]
  },
  {
    key: 'price',
    label: '价格范围',
    type: 'range',
    placeholder: { min: '最低价', max: '最高价' },
    min: 0,
    step: 0.01
  },
  {
    key: 'stock',
    label: '库存范围',
    type: 'range',
    placeholder: { min: '最低库存', max: '最高库存' },
    min: 0
  }
])

// 商品排序配置
const productSortConfigs = ref([
  { value: 'price', label: '价格' },
  { value: 'sales', label: '销量' },
  { value: 'stock', label: '库存' },
  { value: 'rating', label: '评分' },
  { value: 'createTime', label: '创建时间' },
  { value: 'updateTime', label: '更新时间' }
])

// 显示添加模态框
const showAddModal = () => {
  isEditMode.value = false
  editData.value = null
  showModal.value = true
}

// 编辑商品
const handleEdit = (id) => {
  const product = products.value.find(p => p.id === id)
  if (product) {
    isEditMode.value = true
    editData.value = {
      ...product,
      images: product.images ? product.images[0] : ''
    }
    showModal.value = true
  }
}

// 查看商品详情
const handleView = (id) => {
  const product = products.value.find(p => p.id === id)
  if (product) {
    currentProduct.value = product
    showDetailModal.value = true
  }
}

// 从详情模态框编辑商品
const handleEditFromDetail = (id) => {
  handleEdit(id)
}

// 提交商品（添加/编辑）
const handleSubmitProduct = async (formData) => {
  try {
    // 处理表单数据
    const processedForm = {
      ...formData,
      images: [formData.images], // 将图片URL转换为数组
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      stock: Number(formData.stock),
      weight: Number(formData.weight),
      sort: Number(formData.sort) || 0,
      status: Number(formData.status)
    }

    if (isEditMode.value) {
      await updateProduct(processedForm.id, processedForm)
      ElMessage.success('商品更新成功')
    } else {
      await createProduct(processedForm)
      ElMessage.success('商品添加成功')
    }
    showModal.value = false
    await fetchData()
    await fetchAllCategories()
  } catch (error) {
    console.error('保存商品失败:', error)
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
    case 'enable':
      handleBatchStatus(1)
      break
    case 'disable':
      handleBatchStatus(0)
      break
  }
}
</script>

<style lang="scss" scoped>
.products-page {
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
