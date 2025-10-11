<template>
  <div class="pagination">
      <button class="page-btn" @click="handlePrevPage">上一页</button>
      <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
      <button class="page-btn" @click="handleNextPage">下一页</button>
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
  margin-top: 20px;
  gap: 10px;

  .page-btn {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  }

  .page-info {
    font-size: 14px;
    color: #666;
  }
}

</style>
