<template>
  <div class="pagination">
    <button
      class="page-btn"
      :disabled="currentPage <= 1"
      @click="handlePrevPage"
    >
      <span>←</span> 上一页
    </button>
    <span class="page-info">
      第 <span class="current">{{ currentPage }}</span> 页 / 共 <span class="total">{{ totalPages }}</span> 页
    </span>
    <button
      class="page-btn"
      :disabled="currentPage >= totalPages"
      @click="handleNextPage"
    >
      下一页 <span>→</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: Number,
  totalPages: Number
})

const emit = defineEmits(['prev', 'next'])
const handleNextPage = () => {
  if ( props.currentPage < props.totalPages ) {
    emit('next')
  }
}
const handlePrevPage = () => {
  if (props.currentPage > 1) {
    emit('prev')
  }
}

</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.page-btn {
  padding: 8px 16px;
  background: #fff;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  span {
    font-size: 14px;
  }

  &:hover:not(:disabled) {
    background: #10b981;
    color: #fff;
    border-color: #10b981;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    background: #f9fafb;
    color: #d1d5db;
    border-color: #e5e7eb;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.page-info {
  font-size: 13px;
  color: #6b7280;
  user-select: none;

  .current {
    font-weight: 600;
    color: #10b981;
    font-size: 15px;
  }

  .total {
    font-weight: 600;
    color: #374151;
  }
}
</style>
