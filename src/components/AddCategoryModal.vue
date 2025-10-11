<template>
  <div class="modal-overlay" v-show="visible" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title">
          <span class="icon">{{ isEditMode ? '✏️' : '➕' }}</span>
          <h3>{{ isEditMode ? '编辑分类' : '添加分类'}}</h3>
        </div>
        <button class="close-btn" @click="handleClose">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form class="category-form">
          <div class="form-group">
            <label for="name">
              分类名称 <span class="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="请输入分类名称"
              v-model="currentForm.name"
              :class="{ 'input-error': !currentForm.name }"
            >
            <span v-show="!currentForm.name" class="alert-label">请输入分类名称</span>
          </div>

          <div class="form-group">
            <label for="description">描述</label>
            <textarea
              id="description"
              placeholder="请输入分类描述"
              v-model="currentForm.description"
              rows="3"
            ></textarea>
            <span v-show="!currentForm.description" class="alert-label">请输入分类描述</span>
          </div>

          <div class="form-group">
            <label for="parentId">父分类</label>
            <select id="parentId" v-model="currentForm.parentId">
              <option value="">无父分类</option>
              <option
              :value="item.id"
              v-for="item in categories" :key="item.id"
              >{{item.name}}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="sort">
              排序 <span class="required">*</span>
            </label>
            <input
              type="number"
              id="sort"
              placeholder="请输入排序号"
              v-model="currentForm.sort"
              min="1"
              :class="{ 'input-error': !currentForm.sort }"
            >
            <span v-show="!currentForm.sort" class="alert-label">请输入分类排序</span>
          </div>

          <div class="form-group">
            <label>状态</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" value="1" name="status" v-model="currentForm.status">
                <span class="radio-text">✓ 启用</span>
              </label>
              <label class="radio-label">
                <input type="radio" value="0" name="status" v-model="currentForm.status">
                <span class="radio-text">✗ 禁用</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="icon">
              图标URL <span class="required">*</span>
            </label>
            <input
              type="url"
              id="icon"
              placeholder="请输入图标URL"
              v-model="currentForm.icon"
              :class="{ 'input-error': !currentForm.icon }"
            >
            <span v-show="!currentForm.icon" class="alert-label">请输入分类图标URL</span>
          </div>

          <div class="form-group">
            <label for="customAttrs">自定义属性</label>
            <input
              type="text"
              id="customAttrs"
              placeholder="多个属性用逗号分隔，例如：热门,推荐"
              v-model="currentForm.customAttrs"
            >
            <span class="hint-text">多个属性请用逗号分隔</span>
          </div>
        </form>

        <div v-show="successMessage" class="success-message">
          <span class="success-icon">✓</span>
          {{ isEditMode ? '编辑成功' : '添加成功' }}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-cancel" @click="handleClose">
          取消
        </button>
        <button class="btn btn-submit" @click="handleSubmit">
          <span>{{ isEditMode ? '保存' : '添加' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'


const props = defineProps({
  visible: Boolean,
  categories: Array,
  isEditMode: Boolean,
  editId: Number
})
const emit = defineEmits(['close', 'submit'])
const form = ref({
  name: '',
  description: '',
  parentId: '',
  sort: 0,
  status: 1,
  icon: '',
  customAttrs: ''
})
const successMessage = ref(false)
// 关闭
const handleClose = () => {
  successMessage.value = false
  emit('close')
}
// 提交
async function handleSubmit() {
  const { name, description, sort, icon } = currentForm.value
  try {
    if (name && description && sort && icon) {
      const processedForm = { ...currentForm.value }
      processedForm.customAttrs = currentForm.value.customAttrs
        .split(/[，,]/)
        .map(attr => attr.trim())
        .filter(attr => attr.length > 0)

      emit('submit', processedForm)
      successMessage.value = true
      setTimeout(() => {
        handleClose()
        successMessage.value = false
      }, 2000)
      if (!props.isEditMode) {
        const res = await axios.post('/api/categories', processedForm)
        console.log(res.data.message)
        form.value = {
          name: '',
          description: '',
          parentId: '',
          sort: 0,
          status: 1,
          icon: '',
          customAttrs: ''
        }
      }
      else {
        const res = await axios.patch(`/api/categories/${processedForm.id}`, processedForm)
        console.log(res.data.message)
      }

    }
  } catch (error) {
    console.error(error)
    error.value = '网络或服务器错误'
  }
}
// 编辑
const editData = computed(() => {
  if (props.categories && props.editId && props.isEditMode) {
    const found = props.categories.find(item => item.id === props.editId)
    if (found) {
      const data = { ...found }
      data.customAttrs = data.customAttrs.join(',')
      return data
    }
    else
      return null
  }
  else
    return null
})

const currentForm = computed(() => {
  const result = props.isEditMode ? editData.value : form.value
  return result
})








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
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 540px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;

    .icon {
      font-size: 20px;
    }

    h3 {
      margin: 0;
      color: #111827;
      font-size: 18px;
      font-weight: 600;
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
  padding: 24px;
  max-height: calc(85vh - 140px);
  overflow-y: auto;

  .category-form {
    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #374151;
        font-size: 14px;

        .required {
          color: #ef4444;
          margin-left: 2px;
        }
      }

      input, select, textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        font-size: 14px;
        color: #374151;
        box-sizing: border-box;
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

        &.input-error {
          border-color: #ef4444;
          background: #fef2f2;
        }
      }

      textarea {
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
        line-height: 1.5;
      }

      select {
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 36px;
        appearance: none;
      }

      .radio-group {
        display: flex;
        gap: 16px;
        padding: 8px 0;

        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0;
          font-weight: normal;
          cursor: pointer;
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          transition: all 0.2s ease;
          background: #f9fafb;

          input[type="radio"] {
            width: auto;
            margin: 0;
            accent-color: #10b981;
            cursor: pointer;
          }

          .radio-text {
            color: #374151;
            font-size: 14px;
          }

          &:hover {
            border-color: #10b981;
            background: #f0fdf4;
          }

          &:has(input:checked) {
            border-color: #10b981;
            background: #d1fae5;

            .radio-text {
              color: #065f46;
              font-weight: 500;
            }
          }
        }
      }

      .alert-label {
        color: #ef4444;
        font-size: 12px;
        margin-top: 6px;
        display: block;
        font-weight: normal;
      }

      .hint-text {
        color: #9ca3af;
        font-size: 12px;
        margin-top: 6px;
        display: block;
        font-weight: normal;
      }
    }
  }

  .success-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #065f46;
    background: #d1fae5;
    font-size: 14px;
    margin-top: 20px;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 500;
    border: 1px solid #a7f3d0;

    .success-icon {
      font-size: 18px;
      font-weight: 700;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;

  .btn {
    padding: 10px 24px;
    border: 1px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    &.btn-cancel {
      background: #fff;
      color: #6b7280;
      border-color: #d1d5db;

      &:hover {
        background: #f9fafb;
        border-color: #9ca3af;
      }
    }

    &.btn-submit {
      background: #10b981;
      color: #fff;
      border-color: rgba(16, 185, 129, 0.9);

      &:hover {
        background: #059669;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }
}

// 滚动条样式
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;

  &:hover {
    background: #94a3b8;
  }
}
</style>
