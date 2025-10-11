<template>
  <div class="import-export">
    <input type="file" ref="fileInput" accept=".csv,.xlsx,.json" style="display: none" @change="handleFileChange">
    <button class="import-btn" @click="triggerImport">导入</button>
    <select v-model="selectedFormat" class="format-select">
      <option value="csv">CSV</option>
      <option value="xlsx">Excel</option>
      <option value="json">JSON</option>
    </select>
    <button class="export-btn" @click="handleExport">导出</button>
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
  gap: 10px;
  align-items: center;

  .import-btn, .export-btn {
    padding: 10px 20px;
    background-color: #6f42c1;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #5a359a;
    }
  }

  .format-select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
}
</style>
