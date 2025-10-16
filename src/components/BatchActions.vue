<template>
  <div class="batch-actions">
    <div class="action-group">
      <button
        v-for="action in actions"
        :key="action.key"
        :class="action.class"
        @click="handleAction(action)"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  actions: {
    type: Array,
    default: () => []
  }
})

// 使用 props.actions 渲染按钮

const emit = defineEmits(['action'])

const handleAction = (action) => {
  emit('action', action.key, action.params)
}
</script>

<style lang="scss" scoped>
.batch-actions {
  .action-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  button {
    padding: 6px 12px;
    font-size: 13px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;

    &.btn-danger-outline {
      color: #dc2626;
      border-color: #dc2626;

      &:hover {
        background: #fef2f2;
      }
    }

    &.btn-success-outline {
      color: #16a34a;
      border-color: #16a34a;

      &:hover {
        background: #f0fdf4;
      }
    }

    &.btn-secondary-outline {
      color: #6b7280;
      border-color: #6b7280;

      &:hover {
        background: #f9fafb;
      }
    }

    &.btn-primary-outline {
      color: #2563eb;
      border-color: #2563eb;

      &:hover {
        background: #eff6ff;
      }
    }
  }
}
</style>
