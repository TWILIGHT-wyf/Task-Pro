<template>
  <el-table
    ref="tableRef"
    :data="data"
    v-loading="loading"
    stripe
    border
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <!-- 选择列 -->
    <el-table-column
      v-if="showCheckbox"
      type="selection"
      width="55"
      fixed="left"
    />

    <!-- 动态数据列 -->
    <el-table-column
      v-for="header in headers"
      :key="header.key"
      :prop="header.key"
      :label="header.label"
      :min-width="header.width || 120"
      show-overflow-tooltip
    >
      <template #header>
        <slot :name="`header-${header.key}`" :header="header">
          {{ header.label }}
        </slot>
      </template>
      <template #default="{ row }">
        <slot
          :name="`cell-${header.key}`"
          :item="row"
          :header="header"
          :value="row[header.key]"
        >
          <component
            :is="getCellRenderer(header)"
            :item="row"
            :header="header"
            :value="row[header.key]"
            :status-text-map="statusTextMap"
            @action="$emit('action', $event, row)"
          />
        </slot>
      </template>
    </el-table-column>

    <!-- 操作列 - 固定在右侧 -->
    <el-table-column
      v-if="showActions"
      label="操作"
      width="180"
      fixed="right"
      align="center"
    >
      <template #default="{ row }">
        <slot name="actions" :item="row">
          <el-button link type="primary" @click="$emit('view', row.id)">
            查看
          </el-button>
          <el-button link type="primary" @click="$emit('edit', row.id)">
            编辑
          </el-button>
          <!-- 删除确认：使用 el-popconfirm 防止误删 -->
          <el-popconfirm
            title="确定删除此项吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="$emit('delete', row.id)"
          >
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </slot>
      </template>
    </el-table-column>

    <!-- 空数据提示 -->
    <template #empty>
      <el-empty description="暂无数据" />
    </template>
  </el-table>
</template>

<script setup>
import { ref, h, watch } from 'vue'

const DefaultTextCell = {
  name: 'DefaultTextCell',
  props: {
    item: { type: Object, default: null },
    header: { type: Object, default: null },
    value: { type: [String, Number, Boolean, Object, Array, Date, null], default: '' },
    statusTextMap: { type: Object, default: () => ({}) }
  },
  setup(props) {
    return () => {
      const { header, value, item, statusTextMap } = props
      if (value == null) return h('span', { class: 'text-gray-400' }, '-')

      switch (header?.type) {
        case 'avatar':
          return h('div', { class: 'cell-avatar' }, [
            h('el-avatar', { size: 32, src: item?.avatar }),
            h('span', { style: 'margin-left: 8px' }, String(value))
          ])
        case 'email':
          return h('a', { href: `mailto:${value}`, class: 'text-primary' }, value)
        case 'phone':
          return h('a', { href: `tel:${value}`, class: 'text-primary' }, value)
        case 'status-badge': {
          const statusText = statusTextMap[value] || value
          const isActive = ['active', 'on', '上架', '活跃', '正常', 1, '1'].includes(value)
          return h('el-tag', { type: isActive ? 'success' : 'info', size: 'small' }, () => statusText)
        }
        case 'currency':
          return h('span', { class: 'text-price' }, `¥${Number(value).toFixed(2)}`)
        case 'date':
          return h('span', new Date(value).toLocaleString('zh-CN'))
        case 'image': {
          const imgSrc = Array.isArray(value) ? value[0] : value
          return h('el-image', {
            src: imgSrc,
            style: 'width: 50px; height: 50px',
            fit: 'cover',
            previewSrcList: Array.isArray(value) ? value : [value],
            previewTeleported: true
          })
        }
        default:
          return h('span', String(value))
      }
    }
  }
}

const getCellRenderer = (header) => header?.component || DefaultTextCell

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  selectedIds: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => []
  },
  showCheckbox: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  statusTextMap: {
    type: Object,
    default: () => ({
      active: '启用',
      inactive: '禁用',
      1: '启用',
      0: '禁用'
    })
  }
})

const emit = defineEmits(['select', 'select-all', 'edit', 'delete', 'view', 'toggle-status', 'action', 'selection-change'])

const tableRef = ref(null)

const handleSelectionChange = (selection) => {
  const ids = selection.map(item => item.id)
  emit('selection-change', ids)
  if (ids.length === props.data.length && ids.length > 0) {
    emit('select-all', true)
  } else if (ids.length === 0) {
    emit('select-all', false)
  }
}

watch(() => props.selectedIds, (newIds) => {
  if (!tableRef.value) return
  tableRef.value.clearSelection()
  props.data.forEach(row => {
    if (newIds.includes(row.id)) {
      tableRef.value.toggleRowSelection(row, true)
    }
  })
}, { immediate: true, deep: true })

defineExpose({
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row, selected) => tableRef.value?.toggleRowSelection(row, selected)
})
</script>

<style lang="scss" scoped>
.cell-avatar {
  display: flex;
  align-items: center;
}

.text-primary {
  color: var(--el-color-primary);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.text-price {
  color: #f56c6c;
  font-weight: 600;
}

.text-gray-400 {
  color: #9ca3af;
}

:deep(.el-table__empty-block) {
  min-height: 200px;
}
</style>
