<template>
  <div class="pagination">
    <button
      class="btn-base btn-primary"
      :disabled="currentPage <= 1"
      @click="handlePrevPage"
    >
      <span>←</span> 上一页
    </button>
    <span class="page-info">
      第 <span class="current">{{ currentPage }}</span> 页 / 共 <span class="total">{{ totalPages }}</span> 页
    </span>
    <button
      class="btn-base btn-primary"
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
