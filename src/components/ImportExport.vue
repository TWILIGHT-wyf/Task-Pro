<template>
  <div class="import-export">
    <input
      type="file"
      ref="fileInput"
      accept=".csv,.xlsx,.json"
      style="display: none"
      @change="handleFileChange"
    >
    <!-- 使用 el-button 替代原生 button -->
    <el-button :icon="Upload" @click="triggerImport" :loading="importing">
      导入
    </el-button>

    <el-select v-model="selectedFormat" style="width: 100px">
      <el-option label="CSV" value="csv" />
      <el-option label="Excel" value="xlsx" />
      <el-option label="JSON" value="json" />
    </el-select>

    <el-button type="primary" :icon="Download" @click="handleExport" :loading="exporting">
      导出
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const emit = defineEmits(['import', 'export'])

const fileInput = ref(null)
const importing = ref(false)
const exporting = ref(false)

const triggerImport = () => {
  fileInput.value.click()
}

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const type = file.name.split('.').pop().toLowerCase()
  importing.value = true

  try {
    if (type === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data.filter(item => item.name)
          emit('import', data)
          ElMessage.success(`成功导入 ${data.length} 条数据`)
        },
        error: (error) => {
          ElMessage.error('CSV 解析失败')
          console.error('解析失败:', error)
        }
      })
    } else if (type === 'xlsx') {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(worksheet).filter(item => item.name)
      emit('import', data)
      ElMessage.success(`成功导入 ${data.length} 条数据`)
    } else if (type === 'json') {
      const text = await file.text()
      const data = JSON.parse(text).filter(item => item.name)
      emit('import', data)
      ElMessage.success(`成功导入 ${data.length} 条数据`)
    } else {
      ElMessage.warning('不支持的文件格式')
    }
  } catch (error) {
    ElMessage.error('文件处理失败')
    console.error('处理失败:', error)
  } finally {
    importing.value = false
    e.target.value = ''
  }
}

const selectedFormat = ref('csv')

const handleExport = () => {
  exporting.value = true
  emit('export', selectedFormat.value)
  setTimeout(() => {
    exporting.value = false
  }, 500)
}
</script>

<style lang="scss" scoped>
.import-export {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
