<template>
  <div class="search-bar">
      <input type="text" placeholder="搜索分类名称" class="search-input" v-model="keyword" @key.enter="handleSearch">
      <button class="search-btn" @click="handleSearch">搜索</button>
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
  margin-bottom: 20px;
  gap: 10px;

  .search-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .search-btn {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #0056b3;
    }
  }
}

</style>
