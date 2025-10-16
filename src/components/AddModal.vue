<template>
  <div class="modal-overlay" v-show="visible" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title">
          <span class="icon">{{ isEditMode ? '✏️' : icon }}</span>
          <h3>{{ isEditMode ? `编辑${title}` : `添加${title}` }}</h3>
        </div>
        <button class="close-btn" @click="handleClose">
          <span>&times;</span>
        </button>
      </div>

      <div class="modal-body">
        <form class="dynamic-form">
          <div
            v-for="field in fields"
            :key="field.key"
            class="form-group"
            :class="{ 'form-row': field.row }"
          >
            <label :for="field.key">
              {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>

            <!-- 文本输入 -->
            <input
              v-if="field.type === 'text' || field.type === 'email' || field.type === 'url' || field.type === 'tel' || field.type === 'number'"
              :type="field.type"
              :id="field.key"
              :placeholder="field.placeholder"
              v-model="formData[field.key]"
              :class="{ 'input-error': field.required && !formData[field.key] }"
              :min="field.min"
              :step="field.step"
            >

            <!-- 文本域 -->
            <textarea
              v-else-if="field.type === 'textarea'"
              :id="field.key"
              :placeholder="field.placeholder"
              v-model="formData[field.key]"
              :rows="field.rows || 3"
            ></textarea>

            <!-- 下拉选择 -->
            <select
              v-else-if="field.type === 'select'"
              :id="field.key"
              v-model="formData[field.key]"
              :class="{ 'input-error': field.required && !formData[field.key] }"
            >
              <option :value="null" v-if="field.placeholder">{{ field.placeholder }}</option>
              <option
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <!-- 单选按钮组 -->
            <div v-else-if="field.type === 'radio'" class="radio-group">
              <label
                v-for="option in field.options"
                :key="option.value"
                class="radio-label"
              >
                <input
                  type="radio"
                  :name="field.key"
                  :value="option.value"
                  v-model="formData[field.key]"
                >
                <span class="radio-text">{{ option.label }}</span>
              </label>
            </div>

            <span v-if="field.required && !formData[field.key]" class="alert-label">
              {{ field.errorMessage || `请输入${field.label}` }}
            </span>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="handleClose">取消</button>
        <button class="btn-primary" @click="handleSubmit" :disabled="!isFormValid">
          {{ isEditMode ? '保存' : '添加' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: String,
  icon: {
    type: String,
    default: '➕'
  },
  fields: Array,
  isEditMode: Boolean,
  editData: Object
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({})

// 初始化表单数据
const initForm = () => {
  const data = {}
  props.fields.forEach(field => {
    data[field.key] = props.isEditMode && props.editData
      ? props.editData[field.key] || field.default
      : field.default
  })
  formData.value = data
}

// 表单验证
const isFormValid = computed(() => {
  return props.fields.every(field => {
    if (field.required) {
      return formData.value[field.key] !== '' && formData.value[field.key] !== null
    }
    return true
  })
})

// 监听显示状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initForm()
  }
})

// 监听编辑数据变化
watch(() => props.editData, (newData) => {
  if (newData && props.isEditMode) {
    initForm()
  }
}, { deep: true })

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  emit('submit', { ...formData.value })
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.icon {
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 20px;
}

.dynamic-form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-weight: 500;
      color: #374151;

      .required {
        color: #ef4444;
      }
    }

    input, select, textarea {
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &.input-error {
        border-color: #ef4444;
      }

      &::placeholder {
        color: #9ca3af;
      }
    }

    textarea {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }

    select {
      cursor: pointer;
    }

    .radio-group {
      display: flex;
      gap: 16px;
      margin-top: 8px;

      .radio-label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;

        input[type="radio"] {
          width: 16px;
          height: 16px;
          accent-color: #10b981;
        }

        .radio-text {
          font-size: 14px;
          color: #374151;
        }
      }
    }

    .alert-label {
      color: #ef4444;
      font-size: 12px;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary,
.btn-primary {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary {
  background: #fff;
  color: #6b7280;
  border-color: #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
