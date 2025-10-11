
<template>
  <div class="categories-container">
    <!-- 搜索栏 -->
    <SearchBar @search="handleSearch">
    </SearchBar>

    <!-- 操作栏 -->
    <div class="action-bar">
      <button class="add-btn" @click=" isShow = true , isEditMode = false ">添加分类</button>
      <button class="batch-delete-btn" @click="handleBatchDelete">批量删除</button>
      <button class="batch-enable-btn" @click="handleBatchEnable(1)">批量启用</button>
      <button class="batch-disable-btn" @click="handleBatchEnable(0)">批量禁用</button>
      <ImportExport
      @import="handleImport"
      @export="handleExport">
      </ImportExport>
    </div>

    <!-- 分类列表 -->
    <div class="categories-table">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" class="select-all" :checked="isAllSelected" @change="handleSelect"></th>
            <th>ID</th>
            <th>分类名称</th>
            <th>父分类</th>
            <th>排序</th>
            <th>状态</th>
            <th>图标</th>
            <th>商品数量</th>
            <th>描述</th>
            <th>自定义属性</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-for="{ name,sort,productCount,description,customAttrs,createTime,id,icon,status,parentId } in categories" :key="id">
          <tr>
            <td><input type="checkbox" :checked="selectedId.includes(id)" @change="select(id)"></td>
            <td>{{ id }}</td>
            <td class="category-name">{{ name }}</td>
            <td>{{ parentId ? categories.find(item => item.id === parentId)?.name : '-' }}</td>
            <td><span class="drag-handle">⋮⋮</span> {{ sort }}</td>
            <td><span :class="status === 1 ? 'status-enabled' : 'status-disabled'">{{ status === 1 ? '启用' : '未启用'}}</span></td>
            <td>
              <div v-if="iconLoading[id]" class="icon-loading">加载中...</div>
              <img v-else :src="icon" alt="图标" class="category-icon" @load="iconLoading[id] = false" @error="iconLoading[id] = false">
            </td>
            <td>{{ productCount }}</td>
            <td>{{ description }}</td>
            <td><span class="custom-attr" v-for="atter in customAttrs" :key="atter">{{ atter }}</span></td>
            <td>{{ createTime }}</td>
            <td>
              <button class="edit-btn" @click="handleEdit(id)">编辑</button>
              <button class="delete-btn" @click="handleDelete(id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <CustomPagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @Prev="handlePrevPage"
    @Next="handleNextPage "
    >
    </CustomPagination>
  </div>

  <AddCategoryModal
  :visible="isShow"
  :categories="categories"
  :isEditMode="isEditMode"
  :editId="editId"
  @close="isShow = false"
  @submit="handleAddCategory"
  >
  </AddCategoryModal>

</template>

<script setup>
import AddCategoryModal from '@/components/AddCategoryModal.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import ImportExport from '@/components/ImportExport.vue'
import SearchBar from '@/components/SearchBar.vue'
import axios from 'axios'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { ref, onMounted, reactive, watch } from 'vue'

// 初始化
onMounted(async () => {
  await init()
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(null)
const handleNextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await init()
  }
}
const handlePrevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await init()
  }
}

// 搜索
const searchkeyword = ref('')
const handleSearch = async (keyword) => {
  searchkeyword.value = keyword
  await init()
}
watch(searchkeyword, async (newVal) => {
  if (newVal === '') {
    currentPage.value = 1
    await init()
  }
})

// 获取分类列表
const categories = ref()
const iconLoading = reactive({})
async function init() {
  try {
    console.log('开始调用API...')
    const res = await axios.get(`/api/categories?page=${currentPage.value}&size=${pageSize.value}&keyword=${searchkeyword.value}`)
    categories.value = res.data.data.list
    totalPages.value = Math.ceil(res.data.data.totalRecords / pageSize.value)
    // 设置图标加载状态
    categories.value.forEach(item => {
      iconLoading[item.id] = true
    })
  } catch (error) {
    console.error('API调用失败:', error)
    console.error('错误详情:', error.response?.data || error.message)
  }
}

// 添加分类
const isShow = ref()

// 更新列表
const handleAddCategory = async () => {
  await init()
  isShow.value = false
}

// 删除
const handleDelete = async (id) => {
  try {
    await axios.delete(`/api/categories/${id}`)
    await init()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 编辑分类
const isEditMode = ref(false)
const editId = ref()
const handleEdit = async (id) => {
  try {
    isEditMode.value = true
    isShow.value = true
    editId.value = id
  } catch (error) {
    console.error('编辑失败:', error)
  }
}

// 批量选中
const isAllSelected = ref(false)
const selectedId = ref([])
const handleSelect = (e) => {
  isAllSelected.value = e.target.checked
  if (isAllSelected.value) {
    selectedId.value = categories.value.map(item => item.id)
  }
  else {
    selectedId.value = []
  }
}
const select = (id) => {
  const index = selectedId.value.indexOf(id)
  if (index > -1) {
    selectedId.value.splice(index, 1)
  } else {
    selectedId.value.push(id)
  }
  isAllSelected.value = selectedId.value.length === categories.value.length
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedId.value.length === 0) {
    alert('请先选择要删除的项目')
    return
  }
  if (!confirm(`确定删除选中的 ${selectedId.value.length} 个项目吗？`)) {
    return
  }
  try {
    for (const id of selectedId.value) {
      await handleDelete(id)
    }
    selectedId.value = []
    isAllSelected.value = false
  } catch (error) {
    console.error('批量删除失败:', error)
    alert('批量删除过程中出现错误，请检查')
  }
}

// 批量启禁用
const handleBatchEnable = async (status) => {
  if (selectedId.value.length === 0) {
    alert(`请先选择要${status === 1 ? '启用' : '禁用'}的项目`)
    return
  }
  const action = status === 1 ? '启用' : '禁用'
  if (!confirm(`确定${action}选中的 ${selectedId.value.length} 个项目吗？`)) {
    return
  }
  try {
    for (const id of selectedId.value) {
      const res = await axios.patch(`/api/categories/${id}`, { status: status })
      console.log(res.data.message)
    }
    selectedId.value = []
    isAllSelected.value = false
    await init()
  } catch (error) {
    console.error(`批量${action}失败:`, error)
    alert(`批量${action}过程中出现错误，请检查`)
  }
}

// 导入
const handleImport = async (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    alert('导入数据无效')
    return
  }
  try {
    for (const item of data) {
      const processeditem = {
        ...item,
        customAttrs: item.customAttrs
          .split(/[，,]/)
          .map(attr => attr.trim())
          .filter(attr => attr.length > 0)
      }
      await axios.post('/api/categories', processeditem)
    }
    alert(`成功导入 ${data.length} 条数据`)
    await init()
  } catch (error) {
    console.error('导入失败:', error)
    alert('导入过程中出现错误，请检查数据格式')
  }
}

// 导出
const handleExport = async (format) => {
  try {
    const res = await axios.get('/api/categories?page=1&size=1000')
    const data = res.data.data.list
    let blob
    const filename = `categories.${format}`

    if (format === 'csv') {
      const csv = Papa.unparse(data)
      blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    } else if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories')
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    } else if (format === 'json') {
      const json = JSON.stringify(data, null, 2)  // 格式化 JSON
      blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    }
    saveAs(blob, filename)
  } catch (error) {
    console.error('导出失败:', error)
    alert('导出失败')
  }
}




</script>

<style lang="scss" scoped>
.categories-container {
  padding: 20px;
  background-color: #f5f5f5;
  height: 100%;
  min-height: 0;
}



.action-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  .add-btn {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #218838;
    }
  }

  .batch-delete-btn {
    padding: 10px 20px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #c82333;
    }
  }

  .batch-enable-btn {
    padding: 10px 20px;
    background-color: #17a2b8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #138496;
    }
  }

  .batch-disable-btn {
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
}

.categories-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;

      .select-all {
        margin: 0;
      }
    }

    td {
      color: #666;

      input[type="checkbox"] {
        margin: 0;
      }

      .category-name {
        &.level-1 {
          padding-left: 30px;
          position: relative;

          &::before {
            content: "└─";
            position: absolute;
            left: 10px;
            color: #999;
          }
        }
      }

      .drag-handle {
        cursor: move;
        color: #999;
        margin-right: 5px;
        font-size: 12px;
      }

      .status-enabled {
        color: #28a745;
        font-weight: 500;
      }

      .status-disabled {
        color: #dc3545;
        font-weight: 500;
      }

      .category-icon {
        width: 30px;
        height: 30px;
        border-radius: 4px;
        object-fit: cover;
      }

      .icon-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background-color: #f0f0f0;
        border-radius: 4px;
        font-size: 10px;
        color: #999;
      }

      .custom-attr {
        background-color: #e9ecef;
        color: #495057;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }
    }

    .edit-btn {
      padding: 6px 12px;
      background-color: #ffc107;
      color: #212529;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
      font-size: 12px;

      &:hover {
        background-color: #e0a800;
      }
    }

    .delete-btn {
      padding: 6px 12px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;

      &:hover {
        background-color: #c82333;
      }
    }
  }
}





</style>
