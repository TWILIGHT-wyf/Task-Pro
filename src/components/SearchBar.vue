<template>
  <div class="search-bar">
    <!-- 使用 el-input 替代原生 input -->
    <el-input
      v-model="keyword"
      :placeholder="placeholder"
      :prefix-icon="Search"
      clearable
      size="large"
      @keyup.enter="handleSearch"
      @clear="handleClear"
    />
    <el-button type="primary" size="large" @click="handleSearch">
      搜索
    </el-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

defineProps({
  placeholder: {
    type: String,
    default: '搜索...'
  }
})

const keyword = ref('')
const emit = defineEmits(['search'])

const handleSearch = () => {
  emit('search', keyword.value)
}

const handleClear = () => {
  emit('search', '')
}

watch(keyword, (newVal) => {
  if (newVal === '') {
    emit('search', '')
  }
})
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  gap: 12px;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .el-input {
    flex: 1;
  }
}
</style>
