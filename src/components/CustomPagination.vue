<template>
  <div class="pagination-wrapper">
    <!-- 使用 el-pagination 替代手写分页，修复 NaN 问题 -->
    <el-pagination
      v-model:current-page="internalPage"
      v-model:page-size="internalPageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      :disabled="disabled"
      layout="total, sizes, prev, pager, next, jumper"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  // 关键修复：total 初始值为 0，避免 NaN 问题
  total: {
    type: Number,
    default: 0
  },
  // 兼容旧 API：totalPages（会自动计算 total）
  totalPages: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['prev', 'next', 'update:currentPage', 'update:pageSize', 'page-change', 'size-change'])

const internalPage = ref(props.currentPage)
const internalPageSize = ref(props.pageSize)

// 兼容 totalPages 计算 total
const computedTotal = () => {
  if (props.total > 0) return props.total
  // 如果传入 totalPages，反推 total
  return props.totalPages * props.pageSize
}

watch(() => props.currentPage, (val) => {
  internalPage.value = val
})

watch(() => props.pageSize, (val) => {
  internalPageSize.value = val
})

const handleSizeChange = (size) => {
  emit('update:pageSize', size)
  emit('size-change', size)
}

const handleCurrentChange = (page) => {
  const oldPage = props.currentPage
  emit('update:currentPage', page)
  emit('page-change', page)
  // 兼容旧 API
  if (page > oldPage) {
    emit('next')
  } else if (page < oldPage) {
    emit('prev')
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}
</style>
