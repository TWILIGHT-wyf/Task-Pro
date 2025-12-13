<template>
  <!-- 使用 el-dialog 替代手写弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="900px"
    destroy-on-close
    @close="handleClose"
  >
    <template #header>
      <div class="dialog-header">
        <span class="icon"></span>
        <span>{{ title }}</span>
      </div>
    </template>

    <div class="detail-content" v-if="data">
      <!-- 图片展示 -->
      <div class="images-section" v-if="images && images.length > 0">
        <el-image
          :src="mainImage"
          fit="cover"
          class="main-image"
          :preview-src-list="images"
          preview-teleported
        />
        <div class="image-gallery" v-if="images.length > 1">
          <el-image
            v-for="(image, index) in images"
            :key="index"
            :src="image"
            fit="cover"
            class="gallery-image"
            :class="{ active: image === mainImage }"
            @click="mainImage = image"
          />
        </div>
      </div>

      <!-- 字段信息 -->
      <div class="info-sections">
        <div
          v-for="section in sections"
          :key="section.title"
          class="info-section"
        >
          <el-divider content-position="left">
            <span class="section-title">{{ section.title }}</span>
          </el-divider>
          <el-descriptions :column="2" border>
            <el-descriptions-item
              v-for="field in section.fields"
              :key="field.key"
              :label="field.label"
            >
              <template v-if="field.type === 'status'">
                <el-tag :type="getStatusType(field, data[field.key])" size="small">
                  {{ formatFieldValue(field, data[field.key]) }}
                </el-tag>
              </template>
              <template v-else-if="field.type === 'currency'">
                <span class="price">{{ formatFieldValue(field, data[field.key]) }}</span>
              </template>
              <template v-else-if="field.type === 'stock'">
                <el-tag :type="data[field.key] > 10 ? 'success' : 'danger'" size="small">
                  {{ formatFieldValue(field, data[field.key]) }}
                </el-tag>
              </template>
              <template v-else-if="field.type === 'rating'">
                <el-rate
                  :model-value="Number(data[field.key])"
                  disabled
                  show-score
                  score-template="{value}"
                />
              </template>
              <template v-else>
                {{ formatFieldValue(field, data[field.key]) }}
              </template>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
      <el-button v-if="showEdit" type="primary" @click="handleEdit">编辑</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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

const emit = defineEmits(['close', 'edit', 'update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const mainImage = ref('')

watch(() => props.images, (imgs) => {
  if (imgs?.length) mainImage.value = imgs[0]
}, { immediate: true })

const formatFieldValue = (field, value) => {
  if (value === null || value === undefined) return '-'

  if (field.formatValue && typeof field.formatValue === 'function') {
    return field.formatValue(value)
  }

  switch (field.type) {
    case 'currency':
      return `¥${Number(value).toFixed(2)}`
    case 'status':
      return value === 1 ? '上架' : '下架'
    case 'stock':
      return `${value} 件`
    case 'weight':
      return `${value}g`
    case 'rating':
      return value
    case 'boolean':
      return value ? '是' : '否'
    case 'date':
      return new Date(value).toLocaleString('zh-CN')
    case 'category':
      return field.getCategoryName ? field.getCategoryName(value) : `分类ID: ${value}`
    default:
      return value
  }
}

const getStatusType = (field, value) => {
  if (field.formatValue) {
    const formatted = field.formatValue(value)
    if (['活跃', '上架', '已支付', '已发货', '已完成', '正常'].includes(formatted)) {
      return 'success'
    }
  }
  if (value === 1 || value === 'active' || value === 'normal') return 'success'
  return 'info'
}

const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}

const handleEdit = () => {
  emit('edit', props.data?.id || props.data)
  handleClose()
}
</script>

<style lang="scss" scoped>
.dialog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;

  .icon {
    font-size: 20px;
  }
}

.detail-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.images-section {
  .main-image {
    width: 100%;
    height: 280px;
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .image-gallery {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .gallery-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s;

      &:hover,
      &.active {
        border-color: var(--el-color-primary);
      }
    }
  }
}

.info-sections {
  .section-title {
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .price {
    font-size: 18px;
    font-weight: 600;
    color: #f56c6c;
  }
}

:deep(.el-descriptions) {
  margin-bottom: 16px;
}

:deep(.el-dialog__body) {
  max-height: 65vh;
  overflow-y: auto;
}
</style>
