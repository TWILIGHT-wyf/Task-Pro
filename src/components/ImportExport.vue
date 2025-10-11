<template>
  <div class="import-export">
    <input
      type="file"
      ref="fileInput"
      accept=".csv,.xlsx,.json"
      style="display: none"
      @change="handleFileChange"
    >
    <button class="btn-base btn-import" @click="triggerImport">导入
    </button>
    <select v-model="selectedFormat" class="format-select">
      <option value="csv">CSV</option>
      <option value="xlsx">Excel</option>
      <option value="json">JSON</option>
    </select>
    <button class="btn-base btn-export" @click="handleExport">导出
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
const emit = defineEmits('import', 'export')
// 导入
const fileInput = ref(null)
const triggerImport = () => {
  fileInput.value.click()
}
const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  const type = file.name.split('.').pop().toLowerCase()
  try {
    if (type === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data.filter(item => item.name)
          emit('import', data)
          console.log(data)
        },
        error: (error) => {
          console.error('解析失败:', error)
        }
      })
    }
    else if (type === 'xlsx') {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(worksheet).filter(item => item.name)
      emit('import', data)
    }
    else if (type === 'json') {
      const text = await file.text()
      const data = JSON.parse(text).filter(item => item.name)
      emit('import',data)
    }
  } catch (error) {
    console.error('处理失败:',error)
  }
  e.target.value = ''
}
// 导出
const selectedFormat = ref('csv')
const handleExport = () => {
  emit('export',selectedFormat.value)
}


</script>

<style lang="scss" scoped>
.import-export {
  display: flex;
  gap: 8px;
  align-items: center;
}

.format-select {
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  color: #374151;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #10b981;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
    background: #fff;
  }
}
</style>
