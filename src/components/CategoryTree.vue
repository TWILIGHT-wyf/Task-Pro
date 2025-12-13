<template>
  <div class="category-tree">
    <!-- 工具栏 -->
    <div class="tree-toolbar">
      <el-button text type="primary" @click="expandAll">
        <el-icon><FolderOpened /></el-icon> 展开全部
      </el-button>
      <el-button text type="info" @click="collapseAll">
        <el-icon><Folder /></el-icon> 收起全部
      </el-button>
    </div>

    <!-- 使用 Element Plus el-table 展示树形数据 -->
    <el-table
      ref="tableRef"
      :data="treeData"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :default-expand-all="false"
      highlight-current-row
      @selection-change="handleSelectionChange"
      class="category-table"
    >
      <!-- 选择列 -->
      <el-table-column type="selection" width="50" />

      <!-- 分类名称 -->
      <el-table-column prop="name" label="分类名称" min-width="200">
        <template #default="{ row }">
          <div class="name-cell">
            <el-icon class="category-icon-small"><Folder /></el-icon>
            <span class="name-text">{{ row.name }}</span>
            <el-tag v-if="row.children && row.children.length" size="small" type="info">
              {{ row.children.length }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <!-- 排序 -->
      <el-table-column prop="sort" label="排序" width="80" align="center">
        <template #default="{ row }">
          <span class="sort-value">{{ row.sort }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
            inline-prompt
            @change="handleToggleStatus(row.id, row.status)"
          />
        </template>
      </el-table-column>

      <!-- 图标 -->
      <el-table-column prop="icon" label="图标" width="80" align="center">
        <template #default="{ row }">
          <el-image
            v-if="row.icon"
            :src="row.icon"
            :preview-src-list="[row.icon]"
            fit="cover"
            class="category-icon-img"
            preview-teleported
          >
            <template #error>
              <div class="icon-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div v-else class="icon-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-table-column>

      <!-- 商品数量 -->
      <el-table-column prop="productCount" label="商品数量" width="100" align="center">
        <template #default="{ row }">
          <el-tag type="primary" effect="plain">{{ row.productCount || 0 }}</el-tag>
        </template>
      </el-table-column>

      <!-- 描述 -->
      <el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="desc-text">{{ row.description || '-' }}</span>
        </template>
      </el-table-column>

      <!-- 自定义属性 -->
      <el-table-column prop="customAttrs" label="自定义属性" min-width="150">
        <template #default="{ row }">
          <div class="attrs-cell" v-if="row.customAttrs && row.customAttrs.length">
            <el-tag
              v-for="attr in row.customAttrs"
              :key="attr"
              size="small"
              type="success"
              effect="plain"
              class="attr-tag"
            >
              {{ attr }}
            </el-tag>
          </div>
          <span v-else class="no-attr">-</span>
        </template>
      </el-table-column>

      <!-- 创建时间 -->
      <el-table-column prop="createTime" label="创建时间" width="160" align="center">
        <template #default="{ row }">
          <span class="time-text">{{ row.createTime || '-' }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="warning" size="small" text @click="handleEdit(row.id)">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
          <el-button type="danger" size="small" text @click="handleDelete(row.id)">
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { FolderOpened, Folder, Edit, Delete, Picture } from '@element-plus/icons-vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  allCategories: {
    type: Array,
    default: () => []
  },
  selectedIds: {
    type: Array,
    default: () => []
  },
  iconLoading: {
    type: Object,
    default: () => ({})
  },
  extraIncludeIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'select-all', 'edit', 'delete', 'toggle-status'])

const tableRef = ref(null)

// 构建树形结构
const treeData = computed(() => {
  if (!props.allCategories || !Array.isArray(props.allCategories) || !props.categories || !Array.isArray(props.categories)) {
    return []
  }

  const currentPageIds = new Set((props.categories || []).map(item => item.id))
  const nodesToShow = new Set([...currentPageIds, ...((props.extraIncludeIds || []))])

  const collectAncestors = (nodeId) => {
    const node = props.allCategories.find(item => String(item.id) === String(nodeId))
    if (node && node.parentId) {
      nodesToShow.add(node.parentId)
      collectAncestors(node.parentId)
    }
  }

  ;(props.categories || []).forEach(item => collectAncestors(item.id))
  ;(props.extraIncludeIds || []).forEach(id => collectAncestors(id))

  const buildTree = (parentId = null) => {
    return props.allCategories
      .filter(item => String(item.parentId) === String(parentId) && nodesToShow.has(item.id))
      .map(item => ({
        ...item,
        children: buildTree(item.id),
        hasChildren: props.allCategories.some(c => String(c.parentId) === String(item.id))
      }))
      .sort((a, b) => a.sort - b.sort)
  }

  return buildTree()
})

// 展开全部
const expandAll = () => {
  const expandRows = (rows) => {
    rows.forEach(row => {
      if (row.children && row.children.length) {
        tableRef.value?.toggleRowExpansion(row, true)
        expandRows(row.children)
      }
    })
  }
  expandRows(treeData.value)
}

// 收起全部
const collapseAll = () => {
  const collapseRows = (rows) => {
    rows.forEach(row => {
      if (row.children && row.children.length) {
        tableRef.value?.toggleRowExpansion(row, false)
        collapseRows(row.children)
      }
    })
  }
  collapseRows(treeData.value)
}

// 选择变化
const handleSelectionChange = (selection) => {
  const ids = selection.map(item => item.id)
  emit('select-all', ids.length === props.categories.length)
  ids.forEach(id => emit('select', id))
}

// 编辑
const handleEdit = (id) => {
  emit('edit', id)
}

// 删除
const handleDelete = (id) => {
  emit('delete', id)
}

// 状态切换
const handleToggleStatus = (id, status) => {
  emit('toggle-status', id, status)
}
</script>

<style lang="scss" scoped>
.category-tree {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.tree-toolbar {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(180deg, #fafbfc 0%, #f5f7fa 100%);
  border-bottom: 1px solid #ebeef5;
}

.category-table {
  :deep(.el-table__header) {
    th {
      background: #f8f9fa !important;
      color: #374151;
      font-weight: 600;
    }
  }

  :deep(.el-table__row) {
    transition: background 0.2s ease;

    &:hover > td {
      background: #f5f7fa !important;
    }
  }
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .category-icon-small {
    color: #409eff;
    font-size: 16px;
  }

  .name-text {
    color: #111827;
    font-weight: 500;
  }
}

.sort-value {
  color: #6b7280;
  font-weight: 500;
}

.category-icon-img {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #ebeef5;
}

.icon-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  border: 1px solid #ebeef5;
}

.desc-text {
  color: #6b7280;
  font-size: 13px;
}

.attrs-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  .attr-tag {
    margin: 0;
  }
}

.no-attr {
  color: #c0c4cc;
}

.time-text {
  color: #9ca3af;
  font-size: 12px;
}
</style>
