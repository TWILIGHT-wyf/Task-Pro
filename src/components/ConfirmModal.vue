<template>
  <!-- 使用 el-dialog 替代手写确认弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="420px"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleCancel"
  >
    <template #header>
      <div class="dialog-header">
        <el-icon :size="22" :color="type === 'danger' ? '#f56c6c' : '#409eff'">
          <WarningFilled v-if="type === 'danger'" />
          <QuestionFilled v-else />
        </el-icon>
        <span>{{ title }}</span>
      </div>
    </template>

    <p class="confirm-message">{{ message }}</p>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button :type="type === 'danger' ? 'danger' : 'primary'" @click="handleConfirm">
        {{ confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { WarningFilled, QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '您确定要执行此操作吗？'
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger'].includes(value)
  },
  confirmText: {
    type: String,
    default: '确认'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.dialog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.confirm-message {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}
</style>
