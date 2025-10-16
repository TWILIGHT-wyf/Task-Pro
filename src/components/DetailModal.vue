<template>
  <div class="modal-overlay" v-show="visible" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title">
          <span class="icon"></span>
          <h3>{{ title }}</h3>
        </div>
        <button class="close-btn" @click="handleClose">
          <span>&times;</span>
        </button>
      </div>

      <div class="modal-body" v-if="data">
        <div class="detail-content">
          <!-- 图片展示 -->
          <div class="images-section" v-if="images && images.length > 0">
            <div class="main-image">
              <img :src="images[0]" :alt="title" class="main-image">
            </div>
            <div class="image-gallery" v-if="images.length > 1">
              <img
                v-for="(image, index) in images"
                :key="index"
                :src="image"
                :alt="`${title} ${index + 1}`"
                class="gallery-image"
                @click="currentImage = image"
              >
            </div>
          </div>

          <!-- 字段信息 -->
          <div class="info-sections">
            <div
              v-for="section in sections"
              :key="section.title"
              class="info-section"
            >
              <h4 class="section-title">{{ section.title }}</h4>
              <div class="info-grid">
                <div
                  v-for="field in section.fields"
                  :key="field.key"
                  class="info-item"
                >
                  <label>{{ field.label }}：</label>
                  <span :class="getFieldClass(field)">
                    {{ formatFieldValue(field, data[field.key]) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="handleClose">关闭</button>
        <button v-if="showEdit" class="btn-edit" @click="handleEdit">编辑</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: '详情'
  },
  sections: {
    type: Array,
    default: () => []
  },
  images: {
    type: Array,
    default: () => []
  },
  showEdit: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'edit'])

const currentImage = ref('')

// 格式化字段值
const formatFieldValue = (field, value) => {
  if (value === null || value === undefined) return '-'


  if (field.formatValue && typeof field.formatValue === 'function') {
    return field.formatValue(value)
  }

  switch (field.type) {
    case 'currency':
      return `¥${value}`
    case 'status':
      return value === 1 ? '上架' : '下架'
    case 'stock':
      return `${value} 件`
    case 'weight':
      return `${value}g`
    case 'rating':
      return `⭐ ${value}`
    case 'boolean':
      return value ? '是' : '否'
    case 'date':
      return new Date(value).toLocaleString()
    case 'category':
      // 这里需要外部传入分类数据，或者通过回调处理
      return field.getCategoryName ? field.getCategoryName(value) : `分类ID: ${value}`
    default:
      return value
  }
}

// 获取字段样式类
const getFieldClass = (field) => {
  const classes = []
  if (field.type === 'currency') classes.push('price')
  if (field.type === 'status') {
    classes.push('status-badge')
    const value = props.data[field.key]
    // 支持不同的 status 值格式
    if (field.formatValue) {
      // 如果有自定义格式化，使用格式化后的值来判断样式
      const formatted = field.formatValue(value)
      // 根据格式化后的值判断状态
      if (formatted === '活跃' || formatted === '上架' || formatted === '已支付' || formatted === '已发货' || formatted === '已完成' || formatted === '正常') {
        classes.push('status-on')
      } else {
        classes.push('status-off')
      }
    } else {
      // 默认逻辑
      classes.push(value === 1 || value === 'active' || value === 'normal' ? 'status-on' : 'status-off')
    }
  }
  if (field.type === 'stock') {
    classes.push('stock-info')
    classes.push(props.data[field.key] > 10 ? 'stock-normal' : 'stock-low')
  }
  if (field.type === 'rating') classes.push('rating')
  if (field.type === 'sales') classes.push('sales')
  return classes
}

// 关闭模态框
const handleClose = () => {
  emit('close')
}

// 编辑
const handleEdit = () => {
  emit('edit', props.data.id || props.data)
  handleClose()
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;

  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      font-size: 20px;
    }

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f6;
      color: #374151;
    }
  }
}

.modal-body {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;

  .detail-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

.images-section {
  .main-image {
    margin-bottom: 16px;

    .main-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
  }

  .image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 8px;

    .gallery-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #10b981;
        transform: scale(1.05);
      }
    }
  }
}

.info-sections {
  .info-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #10b981;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;

        label {
          font-weight: 500;
          color: #6b7280;
          min-width: 80px;
        }

        span {
          color: #111827;

          &.price {
            font-size: 18px;
            font-weight: 600;
            color: #dc2626;
          }

          &.original-price {
            text-decoration: line-through;
            color: #9ca3af;
          }

          &.stock-info {
            font-weight: 500;

            &.stock-normal {
              color: #065f46;
            }

            &.stock-low {
              color: #dc2626;
            }
          }

          &.sales {
            font-weight: 600;
            color: #059669;
          }

          &.rating {
            color: #f59e0b;
            font-weight: 500;
          }

          &.status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;

            &.status-on {
              background: #d1fae5;
              color: #065f46;
            }

            &.status-off {
              background: #fee2e2;
              color: #991b1b;
            }
          }
        }
      }
    }

    .description {
      color: #4b5563;
      line-height: 1.6;
      padding: 12px;
      background: #f9fafb;
      border-radius: 6px;
      border-left: 4px solid #10b981;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;

  button {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &.btn-cancel {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;

      &:hover {
        background: #e5e7eb;
      }
    }

    &.btn-edit {
      background: #10b981;
      color: white;
      border: 1px solid #10b981;

      &:hover {
        background: #059669;
        border-color: #059669;
      }
    }
  }
}
</style>
