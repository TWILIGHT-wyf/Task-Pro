<template>
  <div class="custom-table">
    <table class="custom-table-content">
      <thead>
        <tr>
          <th class="th-checkbox" v-if="showCheckbox">
            <input type="checkbox" class="checkbox" :checked="isAllSelected" @change="handleSelectAll">
          </th>
          <th v-for="item in headers" :key="item.key">{{ item.label }}</th>
          <th class="th-actions" v-if="showActions">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" class="data-row">
          <td class="td-checkbox" v-if="showCheckbox">
            <input
              type="checkbox"
              class="checkbox"
              :checked="selectedIds.includes(item.id)"
              @change="handleSelect(item.id)"
            >
          </td>
          <td v-for="header in headers" :key="header.key" :class="`td-${header.key}`">
            <component
              v-if="header.component"
              :is="header.component"
              :item="item"
              :header="header"
              @action="$emit('action', $event, item)"
            />
            <template v-else>
              <span v-if="header.type === 'image' && item[header.key]">
                <img :src="item[header.key][0] || item[header.key]" :alt="item.name || 'image'" class="table-image">
              </span>
              <span v-else-if="header.type === 'avatar'">
                <div class="avatar-cell">
                  <div class="avatar">{{ item.name ? item.name.charAt(0).toUpperCase() : '?' }}</div>
                  <span class="avatar-name">{{ item.name }}</span>
                </div>
              </span>
              <span v-else-if="header.type === 'status'">
                <button
                  :class="['status-btn', getStatusClass(item[header.key])]"
                  @click="$emit('toggle-status', item.id, item[header.key])"
                >
                  {{ getStatusText(item[header.key]) }}
                </button>
              </span>
              <span v-else-if="header.type === 'status-badge'">
                <span
                  class="status-badge"
                  :class="getStatusBadgeClass(item[header.key])"
                >
                  {{ getStatusBadgeText(item[header.key]) }}
                </span>
              </span>
              <span v-else-if="header.type === 'price'">
                <div class="price-info">
                  <span class="current-price">¥{{ item[header.key] }}</span>
                  <span v-if="item.originalPrice && item.originalPrice > item[header.key]" class="original-price">¥{{ item.originalPrice }}</span>
                </div>
              </span>
              <span v-else-if="header.type === 'category'">
                {{ getCategoryName(item[header.key]) }}
              </span>
              <span v-else-if="header.type === 'rating'">
                ⭐ {{ item[header.key] }}
              </span>
              <span v-else-if="header.type === 'email'">
                <span class="email-text">{{ item[header.key] }}</span>
              </span>
              <span v-else-if="header.type === 'phone'">
                <span class="phone-text">{{ item[header.key] }}</span>
              </span>
              <span v-else-if="header.type === 'date'">
                <span class="date-text">{{ formatDate(item[header.key]) }}</span>
              </span>
              <span v-else>
                {{ item[header.key] }}
              </span>
            </template>
          </td>
          <td class="td-actions" v-if="showActions">
            <button class="btn-action btn-view" @click="$emit('view', item.id)">查看</button>
            <button class="btn-action btn-edit" @click="$emit('edit', item.id)">编辑</button>
            <button class="btn-action btn-delete" @click="$emit('delete', item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="data.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const emit = defineEmits(['select', 'select-all', 'edit', 'delete', 'view', 'toggle-status', 'action'])

// 是否全选
const isAllSelected = computed(() => {
  return props.data.length > 0 && props.selectedIds.length === props.data.length
})

// 处理选择
const handleSelect = (id) => {
  emit('select', id)
}

// 处理全选
const handleSelectAll = (e) => {
  emit('select-all', e.target.checked)
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = props.categories.find(cat => cat.id === categoryId)
  return category ? category.name : '未知分类'
}

// 获取状态样式类
const getStatusClass = (status) => {
  if (status === 1 || status === 'active') {
    return 'status-on'
  }
  return 'status-off'
}

// 获取状态文本
const getStatusText = (status) => {
  return props.statusTextMap[status] || status
}

// 获取状态徽章文本
const getStatusBadgeText = (status) => {
  return props.statusTextMap[status] || status
}

// 获取状态徽章样式类
const getStatusBadgeClass = (status) => {
  if (status === 'active' || status === 'paid' || status === 'completed') {
    return 'status-active'
  } else if (status === 'inactive' || status === 'cancelled') {
    return 'status-inactive'
  } else if (status === 'pending') {
    return 'status-pending'
  } else if (status === 'shipped') {
    return 'status-shipped'
  }
  return 'status-default'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}
</script>

<style lang="scss" scoped>
.custom-table {
  width: 100%;
  overflow-x: auto;
}

.custom-table-content {
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

    &.th-actions {
      text-align: center;
      width: 150px;
    }
  }

  .data-row {
    &:hover {
      background: #f9fafb;
    }

    td {
      padding: 12px 14px;
      border-bottom: 1px solid #eef2f6;
      color: #4b5563;
      vertical-align: middle;

      &.td-checkbox {
        text-align: center;
      }

      &.td-actions {
        text-align: center;
        white-space: nowrap;

        .btn-action {
          padding: 5px 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          margin: 0 2px;
          transition: all 0.2s ease;

          &.btn-view {
            background: #eff6ff;
            color: #1e40af;

            &:hover {
              background: #dbeafe;
            }
          }

          &.btn-edit {
            background: #fef3c7;
            color: #92400e;

            &:hover {
              background: #fde68a;
            }
          }

          &.btn-delete {
            background: #fee2e2;
            color: #991b1b;

            &:hover {
              background: #fecaca;
            }
          }
        }
      }

      .table-image {
        width: 60px;
        height: 60px;
        border-radius: 6px;
        object-fit: cover;
        border: 1px solid #e5e7eb;
      }

      .status-btn {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;

        &.status-on {
          background: #d1fae5;
          color: #065f46;

          &:hover {
            background: #a7f3d0;
          }
        }

        &.status-off {
          background: #fee2e2;
          color: #991b1b;

          &:hover {
            background: #fecaca;
          }
        }
      }

      .price-info {
        .current-price {
          font-weight: 600;
          color: #dc2626;
        }

        .original-price {
          color: #9ca3af;
          text-decoration: line-through;
          font-size: 12px;
          margin-left: 6px;
        }
      }

      .rating {
        color: #f59e0b;
        font-weight: 500;
      }

      .avatar-cell {
        display: flex;
        align-items: center;
        gap: 10px;

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .avatar-name {
          font-weight: 500;
        }
      }

      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.status-active {
          background: #d1fae5;
          color: #065f46;
        }

        &.status-inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        &.status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        &.status-shipped {
          background: #dbeafe;
          color: #1e40af;
        }

        &.status-default {
          background: #f3f4f6;
          color: #374151;
        }
      }

      .email-text {
        color: #6b7280;
        font-size: 13px;
      }

      .phone-text {
        color: #4b5563;
        font-family: 'Courier New', monospace;
      }

      .date-text {
        color: #6b7280;
        font-size: 13px;
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

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #9ca3af;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
}
</style>
