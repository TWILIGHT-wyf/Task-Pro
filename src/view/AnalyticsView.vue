<template>
  <div class="analytics-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">数据分析</h1>
        <div class="subtitle">数据中心 — 业务分析</div>
      </div>
      <div class="header-actions">
        <select v-model="timeRange" class="time-select" @change="updateCharts">
          <option value="today">今日</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="year">本年</option>
        </select>
      </div>
    </header>

    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <div class="stat-card card-white">
        <div class="stat-icon" style="background: #dbeafe; color: #3b82f6;"><el-icon><DataLine /></el-icon></div>
        <div class="stat-content">
          <div class="stat-label">总销售额</div>
          <div class="stat-value">¥{{ formatNumber(analytics.totalSales) }}</div>
          <div class="stat-trend" :class="analytics.salesTrend > 0 ? 'trend-up' : 'trend-down'">
            {{ analytics.salesTrend > 0 ? '↗' : '↘' }} {{ Math.abs(analytics.salesTrend) }}%
          </div>
        </div>
      </div>

      <div class="stat-card card-white">
        <div class="stat-icon" style="background: #dcfce7; color: #10b981;"><el-icon><ShoppingCart /></el-icon></div>
        <div class="stat-content">
          <div class="stat-label">订单数量</div>
          <div class="stat-value">{{ formatNumber(analytics.totalOrders) }}</div>
          <div class="stat-trend" :class="analytics.ordersTrend > 0 ? 'trend-up' : 'trend-down'">
            {{ analytics.ordersTrend > 0 ? '↗' : '↘' }} {{ Math.abs(analytics.ordersTrend) }}%
          </div>
        </div>
      </div>

      <div class="stat-card card-white">
        <div class="stat-icon" style="background: #fef3c7; color: #f59e0b;"><el-icon><User /></el-icon></div>
        <div class="stat-content">
          <div class="stat-label">新增会员</div>
          <div class="stat-value">{{ formatNumber(analytics.newCustomers) }}</div>
          <div class="stat-trend" :class="analytics.customersTrend > 0 ? 'trend-up' : 'trend-down'">
            {{ analytics.customersTrend > 0 ? '↗' : '↘' }} {{ Math.abs(analytics.customersTrend) }}%
          </div>
        </div>
      </div>

      <div class="stat-card card-white">
        <div class="stat-icon" style="background: #fce7f3; color: #ec4899;"><el-icon><Star /></el-icon></div>
        <div class="stat-content">
          <div class="stat-label">平均评分</div>
          <div class="stat-value">{{ analytics.avgRating.toFixed(1) }}</div>
          <div class="stat-trend trend-up">
            优秀
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <!-- 销售趋势 -->
      <div class="chart-card card-white">
        <div class="chart-header">
          <h3 class="chart-title">销售趋势</h3>
        </div>
        <div class="chart-body">
          <v-chart :option="salesTrendOption" :autoresize="true" style="height: 350px;" />
        </div>
      </div>

      <!-- 商品分类占比 -->
      <div class="chart-card card-white">
        <div class="chart-header">
          <h3 class="chart-title">商品分类销售占比</h3>
        </div>
        <div class="chart-body">
          <v-chart :option="categoryPieOption" :autoresize="true" style="height: 350px;" />
        </div>
      </div>
    </div>

    <!-- 新增图表区域 -->
    <div class="charts-container">
      <!-- 订单状态分布 -->
      <div class="chart-card card-white">
        <div class="chart-header">
          <h3 class="chart-title">订单状态分布</h3>
        </div>
        <div class="chart-body">
          <v-chart :option="orderStatusOption" :autoresize="true" style="height: 350px;" />
        </div>
      </div>

      <!-- 每日访问量趋势 -->
      <div class="chart-card card-white">
        <div class="chart-header">
          <h3 class="chart-title">访问量趋势</h3>
        </div>
        <div class="chart-body">
          <v-chart :option="visitTrendOption" :autoresize="true" style="height: 350px;" />
        </div>
      </div>
    </div>

    <!-- 排行榜 -->
    <div class="rankings-container">
      <!-- 热销商品 -->
      <div class="ranking-card card-white">
        <div class="card-header">
          <h3 class="card-title">热销商品 TOP 10</h3>
        </div>
        <div class="ranking-list">
          <div v-for="(item, index) in topProducts" :key="index" class="ranking-item">
            <div class="ranking-number" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</div>
            <div class="ranking-content">
              <div class="ranking-name">{{ item.name }}</div>
              <div class="ranking-info">销量: {{ item.sales }} | 评分: {{ item.rating }}</div>
            </div>
            <div class="ranking-value">¥{{ formatNumber(item.revenue) }}</div>
          </div>
        </div>
      </div>

      <!-- 活跃会员 -->
      <div class="ranking-card card-white">
        <div class="card-header">
          <h3 class="card-title">活跃会员 TOP 10</h3>
        </div>
        <div class="ranking-list">
          <div v-for="(item, index) in topCustomers" :key="index" class="ranking-item">
            <div class="ranking-number" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</div>
            <div class="ranking-content">
              <div class="ranking-name">{{ item.name }}</div>
              <div class="ranking-info">订单数: {{ item.orders }} | 会员等级: {{ item.level }}</div>
            </div>
            <div class="ranking-value">¥{{ formatNumber(item.totalSpent) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { formatNumber, getDateRange } from '@/utils/format'
import { DataLine, ShoppingCart, User, Star } from '@element-plus/icons-vue'
import { getAnalyticsData } from '@/api/dashboard'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 时间范围
const timeRange = ref('month')

// 分析数据（从API获取）
const analytics = ref({
  totalSales: 0,
  salesTrend: 0,
  totalOrders: 0,
  ordersTrend: 0,
  newCustomers: 0,
  customersTrend: 0,
  avgRating: 0
})

// 销售趋势数据
const salesTrendData = ref([])

// 访问量趋势数据
const visitTrendData = ref({
  xAxis: [],
  pageViews: [],
  visitors: []
})

// 分类数据
const categoryData = ref([])

// 加载分析数据
async function loadAnalyticsData() {
  try {
    const res = await getAnalyticsData(timeRange.value)
    if (res.data) {
      const data = res.data
      // 更新概览数据
      analytics.value = {
        totalSales: data.summary.totalSales,
        salesTrend: parseFloat(data.trend.rate),
        totalOrders: data.summary.totalOrders,
        ordersTrend: parseFloat(data.trend.rate) * 0.8,
        newCustomers: data.summary.totalUsers,
        customersTrend: parseFloat(data.trend.rate) * 1.2,
        avgRating: 4.6
      }

      // 更新分类数据
      const total = data.categoryData.reduce((sum, item) => sum + item.value, 0)
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
      categoryData.value = data.categoryData.map((item, index) => ({
        name: item.name,
        percent: Math.round((item.value / total) * 100),
        amount: item.value,
        color: colors[index % colors.length]
      }))

      // 更新销售趋势
      salesTrendData.value = data.salesTrend.x.map((label, index) => ({
        label,
        value: data.salesTrend.series[index]
      }))

      // 更新访问量趋势
      visitTrendData.value = {
        xAxis: data.visitTrend.x,
        pageViews: data.visitTrend.series,
        visitors: data.visitTrend.series.map(v => Math.round(v * 0.7))
      }
    }
  } catch (error) {
    console.error('加载分析数据失败:', error)
  }
}

// 销售趋势图表配置
const salesTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params) => {
      const data = params[0]
      return `${data.name}<br/>销售额: ¥${data.value.toLocaleString()}`
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: salesTrendData.value.map(item => item.label),
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    },
    axisLabel: {
      color: '#6b7280'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    },
    axisLabel: {
      color: '#6b7280',
      formatter: (value) => `¥${(value / 1000)}K`
    },
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    }
  },
  series: [
    {
      name: '销售额',
      type: 'bar',
      data: salesTrendData.value.map(item => item.value),
      barWidth: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#60a5fa' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        color: '#374151',
        fontSize: 11,
        formatter: (params) => `¥${(params.value / 1000).toFixed(1)}K`
      }
    }
  ]
}))

// 分类饼图配置
const categoryPieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      return `${params.name}<br/>销售额: ¥${params.value.toLocaleString()}<br/>占比: ${params.percent}%`
    }
  },
  legend: {
    orient: 'vertical',
    right: '10%',
    top: 'center',
    textStyle: {
      color: '#6b7280'
    }
  },
  series: [
    {
      name: '销售占比',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {d}%',
        color: '#374151'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: categoryData.value.map(item => ({
        name: item.name,
        value: item.amount,
        itemStyle: { color: item.color }
      }))
    }
  ]
}))

// 订单状态分布
const orderStatusOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    bottom: '5%',
    left: 'center',
    textStyle: {
      color: '#6b7280'
    }
  },
  series: [
    {
      name: '订单状态',
      type: 'pie',
      radius: '65%',
      center: ['50%', '45%'],
      data: [
        { value: 1048, name: '待支付', itemStyle: { color: '#f59e0b' } },
        { value: 735, name: '已支付', itemStyle: { color: '#3b82f6' } },
        { value: 580, name: '已发货', itemStyle: { color: '#8b5cf6' } },
        { value: 484, name: '已完成', itemStyle: { color: '#10b981' } },
        { value: 300, name: '已取消', itemStyle: { color: '#ef4444' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        color: '#374151'
      }
    }
  ]
}))

// 访问量趋势
const visitTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      let result = params[0].name + '<br/>'
      params.forEach(item => {
        result += `${item.seriesName}: ${item.value.toLocaleString()}<br/>`
      })
      return result
    }
  },
  legend: {
    data: ['页面访问量', '独立访客'],
    top: '0%',
    textStyle: {
      color: '#6b7280'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: visitTrendData.value.xAxis,
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    },
    axisLabel: {
      color: '#6b7280'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    },
    axisLabel: {
      color: '#6b7280'
    },
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    }
  },
  series: [
    {
      name: '页面访问量',
      type: 'line',
      smooth: true,
      data: visitTrendData.value.pageViews,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ]
        }
      },
      itemStyle: {
        color: '#3b82f6'
      },
      lineStyle: {
        width: 2
      }
    },
    {
      name: '独立访客',
      type: 'line',
      smooth: true,
      data: visitTrendData.value.visitors,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
          ]
        }
      },
      itemStyle: {
        color: '#10b981'
      },
      lineStyle: {
        width: 2
      }
    }
  ]
}))

// 热销商品
const topProducts = ref([
  { name: 'iPhone 15 Pro Max', sales: 856, rating: 4.8, revenue: 856000 },
  { name: 'MacBook Pro 16"', sales: 423, rating: 4.9, revenue: 846000 },
  { name: 'AirPods Pro 2', sales: 1234, rating: 4.7, revenue: 246800 },
  { name: 'iPad Air', sales: 567, rating: 4.6, revenue: 227000 },
  { name: 'Apple Watch Ultra', sales: 345, rating: 4.8, revenue: 172500 },
  { name: '索尼WH-1000XM5', sales: 678, rating: 4.7, revenue: 135600 },
  { name: '戴森吹风机', sales: 234, rating: 4.5, revenue: 117000 },
  { name: '小米13 Pro', sales: 456, rating: 4.6, revenue: 91200 },
  { name: '华为MateBook', sales: 189, rating: 4.4, revenue: 75600 },
  { name: 'Switch OLED', sales: 321, rating: 4.8, revenue: 64200 }
])

// 活跃会员
const topCustomers = ref([
  { name: '张三', orders: 45, level: 'VIP', totalSpent: 156800 },
  { name: '李四', orders: 38, level: 'VIP', totalSpent: 128900 },
  { name: '王五', orders: 32, level: 'VIP', totalSpent: 98700 },
  { name: '赵六', orders: 28, level: '金牌', totalSpent: 87600 },
  { name: '孙七', orders: 25, level: '金牌', totalSpent: 76500 },
  { name: '周八', orders: 22, level: '金牌', totalSpent: 65400 },
  { name: '吴九', orders: 19, level: '银牌', totalSpent: 54300 },
  { name: '郑十', orders: 17, level: '银牌', totalSpent: 45200 },
  { name: '钱十一', orders: 15, level: '银牌', totalSpent: 38900 },
  { name: '刘十二', orders: 13, level: '铜牌', totalSpent: 32100 }
])

// 更新图表数据
const updateCharts = async () => {
  await loadAnalyticsData()
  const dateRange = getDateRange(timeRange.value)
  console.log('时间范围已更改:', timeRange.value, dateRange)
}

// 页面加载时获取数据
onMounted(() => {
  loadAnalyticsData()
})

// 监听时间范围变化
watch(timeRange, () => {
  updateCharts()
})
</script>

<style lang="scss" scoped>
.analytics-page {
  display: flex;
  flex-direction: column;
  padding: 18px;
  box-sizing: border-box;
  height: 100%;
  background: #f8f9fa;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.subtitle {
  color: #9aa4b2;
  font-size: 13px;
  margin-top: 4px;
}

.time-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;

  &.trend-up {
    color: #10b981;
  }

  &.trend-down {
    color: #ef4444;
  }
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  padding: 20px;
}

.chart-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.chart-body {
  padding: 10px;
}

.rankings-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
}

.ranking-card {
  padding: 20px;
}

.card-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
  }
}

.ranking-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;

  &.top-three {
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    color: white;
  }
}

.ranking-content {
  flex: 1;
}

.ranking-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
}

.ranking-info {
  font-size: 12px;
  color: #6b7280;
}

.ranking-value {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

@media (max-width: 768px) {
  .overview-cards,
  .charts-container,
  .rankings-container {
    grid-template-columns: 1fr;
  }
}
</style>
