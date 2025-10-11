<template>
  <template v-if="visible">
    <tr :class="['tree-row', { 'has-children': hasChildren }]">
      <td class="td-checkbox">
        <input
          type="checkbox"
          class="checkbox"
          :checked="selectedIds.includes(node.id)"
          @change="$emit('select', node.id)"
        >
      </td>
      <td class="td-name">
        <div class="name-cell" :style="{ paddingLeft: `${level * 24 + 8}px` }">
          <span
            v-if="hasChildren"
            class="expand-icon"
            @click="$emit('toggle', node.id)"
          >
            {{ node.expanded ? '▼' : '▶' }}
          </span>
          <span v-else class="expand-placeholder"></span>
          <span class="name-text">{{ node.name }}</span>
          <span v-if="hasChildren" class="children-count">({{ node.children.length }})</span>
        </div>
      </td>
      <td class="td-sort">
        <span class="drag-handle">⋮⋮</span>
        <span class="sort-value">{{ node.sort }}</span>
      </td>
      <td class="td-status">
        <button
          :class="['status-btn', node.status === 1 ? 'status-enabled' : 'status-disabled']"
          @click="$emit('toggle-status', node.id, node.status)"
        >
          {{ node.status === 1 ? '启用' : '未启用' }}
        </button>
      </td>
      <td class="td-icon">
        <div v-if="iconLoading[node.id]" class="icon-loading">
          <span class="loading-spinner">⏳</span>
        </div>
        <img
          v-else
          :src="node.icon"
          alt="图标"
          class="category-icon"
        >
      </td>
      <td class="td-count">
        <span class="count-badge">{{ node.productCount }}</span>
      </td>
      <td class="td-desc">{{ node.description || '-' }}</td>
      <td class="td-attrs">
        <span class="custom-attr" v-for="attr in node.customAttrs" :key="attr">{{ attr }}</span>
      </td>
      <td class="td-time">{{ node.createTime }}</td>
      <td class="td-actions">
        <button class="btn-action btn-edit" @click="$emit('edit', node.id)">编辑</button>
        <button class="btn-action btn-delete" @click="$emit('delete', node.id)">删除</button>
      </td>
    </tr>

    <!-- 递归渲染子节点 -->
    <template v-if="node.expanded && hasChildren">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :selected-ids="selectedIds"
        :icon-loading="iconLoading"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @toggle-status="(id, status) => $emit('toggle-status', id, status)"
      />
    </template>
  </template>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  selectedIds: {
    type: Array,
    default: () => []
  },
  iconLoading: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['toggle', 'select', 'edit', 'delete', 'toggle-status'])

// 是否有子节点
const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

// 是否可见（默认所有节点可见）
const visible = computed(() => true)
</script>

<style lang="scss" scoped>
.tree-row {
  transition: background-color 0.15s ease;

  &:hover {
    background: #f9fafb;
  }

  &.has-children {
    .name-cell {
      font-weight: 500;
    }
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid #eef2f6;
    color: #4b5563;
    vertical-align: middle;

    &.td-checkbox {
      text-align: center;
    }

    &.td-name {
      .name-cell {
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 24px;

        .expand-icon {
          cursor: pointer;
          user-select: none;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #6b7280;
          transition: all 0.2s ease;
          flex-shrink: 0;

          &:hover {
            color: #10b981;
            transform: scale(1.2);
          }
        }

        .expand-placeholder {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .name-text {
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .children-count {
          color: #9ca3af;
          font-size: 11px;
          flex-shrink: 0;
        }
      }
    }

    &.td-sort {
      .drag-handle {
        cursor: move;
        color: #9ca3af;
        margin-right: 6px;
        font-size: 14px;
      }

      .sort-value {
        color: #4b5563;
        font-weight: 500;
      }
    }

    &.td-status {
      .status-btn {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;

        &.status-enabled {
          background: #d1fae5;
          color: #065f46;

          &:hover {
            background: #a7f3d0;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
          }
        }

        &.status-disabled {
          background: #fee2e2;
          color: #991b1b;

          &:hover {
            background: #fecaca;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
          }
        }
      }
    }

    &.td-icon {
      .category-icon {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        object-fit: cover;
        border: 1px solid #e5e7eb;
      }

      .icon-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #f3f7fb, #ffffff);
        border-radius: 6px;
        border: 1px solid #e5e7eb;
        font-size: 12px;
        color: #9ca3af;

        .loading-spinner {
          font-size: 16px;
        }
      }
    }

    &.td-count {
      .count-badge {
        display: inline-block;
        padding: 4px 10px;
        background: #eff6ff;
        color: #1e40af;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }
    }

    &.td-desc {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #6b7280;
    }

    &.td-attrs {
      .custom-attr {
        display: inline-block;
        background: #f3f4f6;
        color: #374151;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        margin-right: 4px;
        margin-bottom: 4px;
      }
    }

    &.td-time {
      color: #9ca3af;
      font-size: 12px;
      white-space: nowrap;
    }

    &.td-actions {
      text-align: center;
      white-space: nowrap;

      .btn-action {
        padding: 5px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        margin: 0 3px;
        transition: all 0.2s ease;

        &.btn-edit {
          background: #fef3c7;
          color: #92400e;

          &:hover {
            background: #fde68a;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
          }
        }

        &.btn-delete {
          background: #fee2e2;
          color: #991b1b;

          &:hover {
            background: #fecaca;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
          }
        }
      }
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
