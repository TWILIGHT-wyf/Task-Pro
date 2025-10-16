<template>
  <div class="category-tree">
    <div class="tree-toolbar">
      <button class="btn-tree-action" @click="expandAll">
        <span>📂</span> 展开全部
      </button>
      <button class="btn-tree-action" @click="collapseAll">
        <span>📁</span> 收起全部
      </button>
    </div>
    <table class="tree-table">
      <thead>
        <tr>
          <th class="th-checkbox">
            <input type="checkbox" class="checkbox" :checked="isAllSelected" @change="handleSelectAll">
          </th>
          <th class="th-name">分类名称</th>
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
        <template v-for="item in treeData" :key="item.id">
          <TreeNode
            :node="item"
            :level="0"
            :selected-ids="selectedIds"
            :icon-loading="iconLoading"
            @toggle="handleToggle"
            @select="handleSelect"
            @edit="handleEdit"
            @delete="handleDelete"
            @toggle-status="handleToggleStatus"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import TreeNode from './TreeNode.vue'

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
  // 额外强制包含的分类ID列表（用于刚创建的分类等场景）
  extraIncludeIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'select-all', 'edit', 'delete', 'toggle-status'])

// 构建树形结构（仅渲染：当前页节点 + 它们的祖先节点）以配合分页
const expandedState = ref({})

const treeData = computed(() => {
  if (!props.allCategories || !Array.isArray(props.allCategories) || !props.categories || !Array.isArray(props.categories)) {
    return []
  }

  // 获取当前页所有分类的ID集合
  const currentPageIds = new Set((props.categories || []).map(item => item.id))

  // 收集需要显示的节点：当前页的节点 + 额外包含的节点 + 它们的祖先节点
  const nodesToShow = new Set([...currentPageIds, ...((props.extraIncludeIds || []))])

  // 递归收集祖先节点
  const collectAncestors = (nodeId) => {
    const node = props.allCategories.find(item => String(item.id) === String(nodeId))
    if (node && node.parentId) {
      nodesToShow.add(node.parentId)
      collectAncestors(node.parentId)
    }
  }

  // 为当前页的每个节点收集祖先
  ;(props.categories || []).forEach(item => {
    collectAncestors(item.id)
  })

  // 为额外包含的节点收集祖先
  ;(props.extraIncludeIds || []).forEach(id => {
    collectAncestors(id)
  })

  // 构建树形结构，只包含需要显示的节点
  const buildTree = (parentId = null) => {
    return props.allCategories
      .filter(item => String(item.parentId) === String(parentId) && nodesToShow.has(item.id))
      .map(item => ({
        ...item,
        children: buildTree(item.id),
        expanded: expandedState.value[item.id] ?? (parentId === null) // 根节点默认展开
      }))
      .sort((a, b) => a.sort - b.sort)
  }

  return buildTree()
})

// 是否全选
const isAllSelected = computed(() => {
  return props.categories && props.categories.length > 0 && props.selectedIds && props.selectedIds.length === props.categories.length
})

// 处理选择
const handleSelect = (id) => {
  emit('select', id)
}

// 处理全选
const handleSelectAll = (e) => {
  emit('select-all', e.target.checked)
}

// 处理展开/折叠
const handleToggle = (id) => {
  expandedState.value[id] = !expandedState.value[id]
}

// 展开全部
const expandAll = () => {
  const setAllExpanded = (nodes, state) => {
    nodes.forEach(node => {
      expandedState.value[node.id] = state
      if (node.children && node.children.length > 0) {
        setAllExpanded(node.children, state)
      }
    })
  }
  setAllExpanded(treeData.value, true)
}

// 收起全部（将整棵树的展开状态设置为 false）
const collapseAll = () => {
  const setAllExpanded = (nodes, state) => {
    nodes.forEach(node => {
      expandedState.value[node.id] = state
      if (node.children && node.children.length > 0) {
        setAllExpanded(node.children, state)
      }
    })
  }
  setAllExpanded(treeData.value, false)
}

// 处理编辑
const handleEdit = (id) => {
  emit('edit', id)
}

// 处理删除
const handleDelete = (id) => {
  emit('delete', id)
}

// 处理状态切换
const handleToggleStatus = (id, status) => {
  emit('toggle-status', id, status)
}
</script>

<style lang="scss" scoped>
.category-tree {
  width: 100%;
  overflow-x: auto;
}

.tree-toolbar {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;

  .btn-tree-action {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f9fafb;
      border-color: #10b981;
      color: #10b981;
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);
    }

    span {
      font-size: 14px;
    }
  }
}

.tree-table {
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

    &.th-name {
      min-width: 250px;
    }

    &.th-actions {
      text-align: center;
    }
  }
}

.checkbox {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #10b981;
}
</style>
