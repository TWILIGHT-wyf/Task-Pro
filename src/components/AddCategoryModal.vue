<template>
  <div class="modal-overlay" v-show="visible">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditMode ? '编辑分类' : '添加分类'}}</h3>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>
      <div class="modal-body">
        <form class="category-form">
          <div class="form-group">
            <label for="name">分类名称 *</label>
            <label v-show="!currentForm.name" class="alert-label">请输入分类名称</label>
            <input type="text" id="name" placeholder="请输入分类名称"
             v-model="currentForm.name"
             >
          </div>

          <div class="form-group">
            <label for="description">描述</label>
            <label v-show="!currentForm.description" class="alert-label">请输入分类描述</label>
            <textarea id="description" placeholder="请输入分类描述" v-model="currentForm.description"></textarea>
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
            <label for="sort">排序</label>
            <label v-show="!currentForm.sort" class="alert-label">请输入分类排序</label>
            <input type="number" id="sort" placeholder="请输入排序号" v-model="currentForm.sort" min="1">
          </div>

          <div class="form-group">
            <label>状态</label>
            <div class="radio-group">
              <label>
                <input type="radio" value="1" name="status" v-model="currentForm.status"> 启用
              </label>
              <label>
                <input type="radio" value="0" name="status" v-model="currentForm.status"> 禁用
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="icon">图标URL</label>
            <label v-show="!currentForm.icon" class="alert-label">请输入分类图标URL</label>
            <input type="url" id="icon" placeholder="请输入图标URL" v-model="currentForm.icon">
          </div>

          <div class="form-group">
            <label for="customAttrs">自定义属性</label>
            <input type="text" id="customAttrs" placeholder="多个属性用逗号分隔" v-model="currentForm.customAttrs">
          </div>
        </form>
        <div v-show="successMessage" class="success-label">{{ isEditMode ? '编辑成功' : '添加成功' }}</div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="submit-btn" @click="handleSubmit">确定</button>
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;

  h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &:hover {
      background-color: #f5f5f5;
      color: #666;
    }
  }
}

.modal-body {
  padding: 20px;

  .category-form {
    .form-group {
      margin-bottom: 16px;

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #333;
        font-size: 14px;
      }

      input, select, textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
      }

      textarea {
        resize: vertical;
        min-height: 80px;
      }

      .radio-group {
        display: flex;
        gap: 20px;

        label {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 0;
          font-weight: normal;
          cursor: pointer;

          input[type="radio"] {
            width: auto;
            margin: 0;
          }
        }
      }

      .alert-label {
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
        display: block;
      }
    }
  }

  .success-label {
    color: #28a745;
    font-size: 14px;
    margin-top: 16px;
    text-align: center;
    font-weight: 500;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #eee;

  .cancel-btn {
    padding: 10px 20px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #5a6268;
    }
  }

  .submit-btn {
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
