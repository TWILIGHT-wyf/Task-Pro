<template>
  <div class="modal-overlay" v-show="visible" @click.self="handleCancel">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title">
          <span class="icon">{{ type === 'danger' ? '⚠️' : '❓' }}</span>
          <h3>{{ title }}</h3>
        </div>
        <button class="close-btn" @click="handleCancel">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-message">{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn-base btn-secondary-outline" @click="handleCancel">
          取消
        </button>
        <button :class="['btn-base', type === 'danger' ? 'btn-danger' : 'btn-primary']" @click="handleConfirm">
          <span>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

defineProps({
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
    default: 'primary', // 'primary' | 'danger'
    validator: (value) => ['primary', 'danger'].includes(value)
  },
  confirmText: {
    type: String,
    default: '确认'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 420px;
  width: 90%;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e5e7eb;

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;

    .icon {
      font-size: 20px;
    }

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s ease;

    span {
      font-size: 24px;
      color: #9ca3af;
    }

    &:hover {
      background: #fee2e2;

      span {
        color: #dc2626;
      }
    }
  }
}

.modal-body {
  padding: 20px 24px;

  .modal-message {
    margin: 0;
    font-size: 14px;
    color: #4b5563;
    line-height: 1.5;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 20px;
}
</style>
