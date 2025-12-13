<template>
  <div class="batch-actions">
    <el-space wrap>
      <!-- 使用 el-button 替代原生 button -->
      <el-button
        v-for="action in actions"
        :key="action.key"
        :type="getButtonType(action)"
        :plain="isPlain(action)"
        size="small"
        @click="handleAction(action)"
      >
        {{ action.label }}
      </el-button>
    </el-space>
  </div>
</template>

<script setup>
const props = defineProps({
  actions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['action'])

const getButtonType = (action) => {
  if (action.class?.includes('danger')) return 'danger'
  if (action.class?.includes('success')) return 'success'
  if (action.class?.includes('primary')) return 'primary'
  if (action.class?.includes('secondary')) return 'info'
  return 'default'
}

const isPlain = (action) => {
  return action.class?.includes('outline') ?? true
}

const handleAction = (action) => {
  emit('action', action.key, action.params)
}
</script>

<style lang="scss" scoped>
.batch-actions {
  display: flex;
  align-items: center;
}
</style>
