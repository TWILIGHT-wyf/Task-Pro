<template>
  <div class="custom-filter">
    <!-- 筛选条件 -->
    <el-row :gutter="16" v-if="filterConfigs.length > 0" class="filter-section">
      <el-col
        v-for="config in filterConfigs"
        :key="config.key"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <div class="filter-item">
          <span class="filter-label">{{ config.label }}</span>

          <!-- 下拉选择 -->
          <el-select
            v-if="config.type === 'select'"
            v-model="filters[config.key]"
            :placeholder="config.placeholder || '全部'"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="option in config.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>

          <!-- 数字范围 -->
          <div v-else-if="config.type === 'range'" class="range-input">
            <el-input-number
              v-model="filters[config.key + 'Min']"
              :placeholder="config.placeholder?.min || '最小值'"
              :min="config.min"
              :step="config.step"
              controls-position="right"
              @change="handleFilterChange"
            />
            <span class="range-separator">-</span>
            <el-input-number
              v-model="filters[config.key + 'Max']"
              :placeholder="config.placeholder?.max || '最大值'"
              :min="config.min"
              :step="config.step"
              controls-position="right"
              @change="handleFilterChange"
            />
          </div>

          <!-- 文本输入 -->
          <el-input
            v-else-if="config.type === 'text'"
            v-model="filters[config.key]"
            :placeholder="config.placeholder"
            clearable
            @input="handleFilterChange"
          />

          <!-- 数字输入 -->
          <el-input-number
            v-else-if="config.type === 'number'"
            v-model="filters[config.key]"
            :placeholder="config.placeholder"
            :min="config.min"
            :step="config.step"
            controls-position="right"
            @change="handleFilterChange"
          />
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="filter-actions">
        <el-button @click="handleReset">重置筛选</el-button>
      </el-col>
    </el-row>

    <!-- 排序选项 -->
    <el-row :gutter="16" v-if="sortConfigs.length > 0" class="sort-section">
      <el-col :xs="24" :sm="12" :md="8">
        <div class="sort-group">
          <span class="sort-label">排序方式：</span>
          <el-select v-model="sortBy" placeholder="默认排序" clearable @change="handleSortChange">
            <el-option
              v-for="config in sortConfigs"
              :key="config.value"
              :label="config.label"
              :value="config.value"
            />
          </el-select>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" v-if="sortBy">
        <div class="sort-group">
          <span class="sort-label">排序顺序：</span>
          <el-radio-group v-model="sortOrder" @change="handleSortChange">
            <el-radio-button value="asc">↑ 升序</el-radio-button>
            <el-radio-button value="desc">↓ 降序</el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  filterConfigs: {
    type: Array,
    default: () => []
  },
  sortConfigs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter', 'sort'])

const filters = reactive({})

const initFilters = () => {
  props.filterConfigs.forEach(config => {
    if (config.type === 'range') {
      filters[config.key + 'Min'] = undefined
      filters[config.key + 'Max'] = undefined
    } else {
      filters[config.key] = ''
    }
  })
}

const sortBy = ref('')
const sortOrder = ref('desc')

initFilters()

const handleFilterChange = () => {
  const filterData = {}
  props.filterConfigs.forEach(config => {
    if (config.type === 'range') {
      const minKey = config.key + 'Min'
      const maxKey = config.key + 'Max'
      if (filters[minKey] != null || filters[maxKey] != null) {
        filterData[minKey] = filters[minKey]
        filterData[maxKey] = filters[maxKey]
      }
    } else if (filters[config.key]) {
      filterData[config.key] = filters[config.key]
    }
  })
  emit('filter', filterData)
}

const handleSortChange = () => {
  if (sortBy.value) {
    emit('sort', {
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    })
  } else {
    emit('sort', null)
  }
}

const handleReset = () => {
  props.filterConfigs.forEach(config => {
    if (config.type === 'range') {
      filters[config.key + 'Min'] = undefined
      filters[config.key + 'Max'] = undefined
    } else {
      filters[config.key] = ''
    }
  })
  sortBy.value = ''
  sortOrder.value = 'desc'
  emit('filter', {})
  emit('sort', null)
}

defineExpose({
  reset: handleReset
})
</script>

<style lang="scss" scoped>
.custom-filter {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--el-border-color-light);
}

.filter-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;

  .filter-label {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    font-weight: 500;
  }

  .el-select,
  .el-input,
  .el-input-number {
    width: 100%;
  }

  .range-input {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-input-number {
      flex: 1;
    }

    .range-separator {
      color: var(--el-text-color-secondary);
    }
  }
}

.filter-actions {
  display: flex;
  align-items: flex-end;
  padding-bottom: 12px;
}

.sort-section {
  .sort-group {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .sort-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      white-space: nowrap;
    }

    .el-select {
      width: 160px;
    }
  }
}
</style>
