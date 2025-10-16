<template>
  <div class="custom-filter">
    <!-- 筛选条件 -->
    <div class="filter-section" v-if="filterConfigs.length > 0">
      <div class="filter-group">
        <div
          v-for="config in filterConfigs"
          :key="config.key"
          class="filter-item"
        >
          <label class="filter-label">{{ config.label }}</label>

          <!-- 下拉选择 -->
          <select
            v-if="config.type === 'select'"
            v-model="filters[config.key]"
            class="filter-select"
            @change="handleFilterChange"
          >
            <option value="">{{ config.placeholder || '全部' }}</option>
            <option
              v-for="option in config.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- 数字范围 -->
          <div v-else-if="config.type === 'range'" class="range-input">
            <input
              type="number"
              :placeholder="config.placeholder?.min || '最小值'"
              v-model="filters[config.key + 'Min']"
              class="filter-input"
              @input="handleFilterChange"
              :min="config.min"
              :step="config.step"
            >
            <span class="range-separator">-</span>
            <input
              type="number"
              :placeholder="config.placeholder?.max || '最大值'"
              v-model="filters[config.key + 'Max']"
              class="filter-input"
              @input="handleFilterChange"
              :min="config.min"
              :step="config.step"
            >
          </div>

          <!-- 文本输入 -->
          <input
            v-else-if="config.type === 'text'"
            type="text"
            :placeholder="config.placeholder"
            v-model="filters[config.key]"
            class="filter-input"
            @input="handleFilterChange"
          >

          <!-- 数字输入 -->
          <input
            v-else-if="config.type === 'number'"
            type="number"
            :placeholder="config.placeholder"
            v-model="filters[config.key]"
            class="filter-input"
            @input="handleFilterChange"
            :min="config.min"
            :step="config.step"
          >
        </div>

        <div class="filter-actions">
          <button class="btn-reset" @click="handleReset">
            重置筛选
          </button>
        </div>
      </div>
    </div>

    <!-- 排序选项 -->
    <div class="sort-section" v-if="sortConfigs.length > 0">
      <div class="sort-group">
        <label class="sort-label">排序方式：</label>
        <select v-model="sortBy" class="sort-select" @change="handleSortChange">
          <option value="">默认排序</option>
          <option
            v-for="config in sortConfigs"
            :key="config.value"
            :value="config.value"
          >
            {{ config.label }}
          </option>
        </select>
      </div>

      <div class="sort-group" v-if="sortBy">
        <label class="sort-label">排序顺序：</label>
        <div class="sort-direction">
          <button
            :class="['sort-btn', sortOrder === 'asc' ? 'active' : '']"
            @click="handleSortDirection('asc')"
          >
            ↑ 升序
          </button>
          <button
            :class="['sort-btn', sortOrder === 'desc' ? 'active' : '']"
            @click="handleSortDirection('desc')"
          >
            ↓ 降序
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  // 筛选配置
  filterConfigs: {
    type: Array,
    default: () => []
  },
  // 排序配置
  sortConfigs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter', 'sort'])

// 筛选条件
const filters = reactive({})

// 初始化筛选条件
const initFilters = () => {
  props.filterConfigs.forEach(config => {
    if (config.type === 'range') {
      filters[config.key + 'Min'] = ''
      filters[config.key + 'Max'] = ''
    } else {
      filters[config.key] = ''
    }
  })
}

// 排序条件
const sortBy = ref('')
const sortOrder = ref('desc')

// 初始化
initFilters()

// 监听筛选条件变化
const handleFilterChange = () => {
  const filterData = {}
  props.filterConfigs.forEach(config => {
    if (config.type === 'range') {
      const minKey = config.key + 'Min'
      const maxKey = config.key + 'Max'
      if (filters[minKey] || filters[maxKey]) {
        filterData[minKey] = filters[minKey]
        filterData[maxKey] = filters[maxKey]
      }
    } else if (filters[config.key]) {
      filterData[config.key] = filters[config.key]
    }
  })
  emit('filter', filterData)
}

// 监听排序条件变化
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

// 排序方向变化
const handleSortDirection = (direction) => {
  sortOrder.value = direction
  handleSortChange()
}

// 重置筛选
const handleReset = () => {
  props.filterConfigs.forEach(config => {
    if (config.type === 'range') {
      filters[config.key + 'Min'] = ''
      filters[config.key + 'Max'] = ''
    } else {
      filters[config.key] = ''
    }
  })
  sortBy.value = ''
  sortOrder.value = 'desc'
  emit('filter', {})
  emit('sort', null)
}

// 暴露重置方法给父组件
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
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.filter-group {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 160px;

  .filter-label {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
  }

  .filter-select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #374151;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    &:hover {
      border-color: #d1d5db;
    }
  }

  .range-input {
    display: flex;
    align-items: center;
    gap: 4px;

    .filter-input {
      width: 80px;
      padding: 8px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      &::placeholder {
        color: #9ca3af;
      }
    }

    .range-separator {
      color: #6b7280;
      font-weight: 500;
    }
  }

  .filter-input {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }
}

.filter-actions {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-left: auto;
}

.btn-reset {
  padding: 8px 14px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }

  &:active {
    background: #d1d5db;
  }
}

.sort-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;

  .sort-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    white-space: nowrap;
  }

  .sort-select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;

    &:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    &:hover {
      border-color: #d1d5db;
    }
  }

  .sort-direction {
    display: flex;
    gap: 4px;

    .sort-btn {
      padding: 6px 12px;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #e5e7eb;
        border-color: #9ca3af;
      }

      &.active {
        background: #10b981;
        color: white;
        border-color: #10b981;
      }
    }
  }
}

@media (max-width: 768px) {
  .filter-group {
    flex-direction: column;
    align-items: stretch;

    .filter-item {
      min-width: auto;

      .range-input {
        width: 100%;

        .filter-input {
          flex: 1;
        }
      }
    }
  }

  .sort-section {
    flex-direction: column;
    align-items: stretch;

    .sort-group {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      .sort-direction {
        width: 100%;

        .sort-btn {
          flex: 1;
        }
      }
    }
  }
}
</style>
