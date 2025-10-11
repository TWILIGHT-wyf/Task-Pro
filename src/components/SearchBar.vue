<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        placeholder="搜索分类名称..."
        class="search-input"
        v-model="keyword"
        @keyup.enter="handleSearch"
      >
    </div>
    <button class="btn-base btn-primary" @click="handleSearch">搜索</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const keyword = ref('')
const emit = defineEmits('search')
const handleSearch = () => {
  emit('search',keyword.value)
}
watch(keyword, (newVal) => {
  if (newVal === '') {
    emit('search',keyword.value)
  }
})
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  gap: 10px;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.06);
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 12px;
    font-size: 16px;
    color: #9ca3af;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 10px 12px 10px 38px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #374151;
    transition: all 0.2s ease;
    background: #f9fafb;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #10b981;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  }
}
</style>
