<template>
  <!-- 使用 el-dialog 替代手写弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? `编辑${title}` : `添加${title}`"
    width="600px"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <template #header>
      <div class="dialog-header">
        <span>{{ isEditMode ? `编辑${title}` : `添加${title}` }}</span>
      </div>
    </template>

    <!-- 使用 el-form 实现表单验证 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="top"
    >
      <el-form-item
        v-for="field in fields"
        :key="field.key"
        :label="field.label"
        :prop="field.key"
        :required="field.required"
      >
        <!-- 文本/邮箱/URL 输入 -->
        <el-input
          v-if="field.type === 'text' || field.type === 'email' || field.type === 'url' || field.type === 'tel'"
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
          clearable
        />

        <!-- 数字输入 -->
        <el-input-number
          v-else-if="field.type === 'number'"
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
          :min="field.min"
          :step="field.step || 1"
          :precision="field.step < 1 ? 2 : 0"
          controls-position="right"
          style="width: 100%"
        />

        <!-- 文本域 -->
        <el-input
          v-else-if="field.type === 'textarea'"
          v-model="formData[field.key]"
          type="textarea"
          :placeholder="field.placeholder"
          :rows="field.rows || 3"
        />

        <!-- 下拉选择 -->
        <el-select
          v-else-if="field.type === 'select'"
          v-model="formData[field.key]"
          :placeholder="field.placeholder || '请选择'"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="option in getOptions(field)"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <!-- 单选按钮组 -->
        <el-radio-group
          v-else-if="field.type === 'radio'"
          v-model="formData[field.key]"
        >
          <el-radio
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        {{ isEditMode ? '保存' : '添加' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: Boolean,
  title: String,
  icon: {
    type: String,
    default: ''
  },
  fields: Array,
  isEditMode: Boolean,
  editData: Object
})

const emit = defineEmits(['close', 'submit', 'update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const formRef = ref(null)
const formData = ref({})
const submitting = ref(false)

// 处理 computed options（如分类列表）
const getOptions = (field) => {
  if (typeof field.options === 'function') return field.options()
  if (field.options?.value) return field.options.value
  return field.options || []
}

// 动态生成表单验证规则
const formRules = computed(() => {
  const rules = {}
  props.fields?.forEach(field => {
    if (field.required) {
      rules[field.key] = [
        {
          required: true,
          message: field.errorMessage || `请输入${field.label}`,
          trigger: field.type === 'select' ? 'change' : 'blur'
        }
      ]
      // 邮箱格式验证
      if (field.type === 'email') {
        rules[field.key].push({
          type: 'email',
          message: '请输入有效的邮箱地址',
          trigger: 'blur'
        })
      }
    }
  })
  return rules
})

const initForm = () => {
  const data = {}
  props.fields?.forEach(field => {
    data[field.key] = props.isEditMode && props.editData
      ? props.editData[field.key] ?? field.default
      : field.default
  })
  formData.value = data
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    initForm()
    // 重置表单验证状态
    setTimeout(() => formRef.value?.clearValidate(), 0)
  }
})

watch(() => props.editData, (newData) => {
  if (newData && props.isEditMode) {
    initForm()
  }
}, { deep: true })

const handleClose = () => {
  formRef.value?.resetFields()
  emit('close')
  emit('update:visible', false)
}

// 关键修复：提交前必须调用 validate() 验证
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true
    emit('submit', { ...formData.value })
  } catch {
    ElMessage.warning('请检查表单填写是否正确')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.dialog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;

  .icon {
    font-size: 20px;
  }
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
  max-height: 60vh;
  overflow-y: auto;
}
</style>
