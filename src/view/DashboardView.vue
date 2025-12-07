<template>
  <div class="dashboard-page">

    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="page-title">仪表盘</h1>
        <div class="subtitle">商城后台管理系统 — 概览</div>
      </div>

      <div class="header-actions"></div>
    </header>


    <section class="kpi-row">
      <div class="kpi-card" v-for="(item, key) in stats" :key="key">
        <div class="kpi-title">{{ item.title }}</div>
        <div class="kpi-value">{{ item.value }}</div>
        <div class="kpi-note">{{ item.note }} <span style="color: #10b981;">{{ item.trend }}</span></div>
      </div>
    </section>


    <section class="main-grid">
      <div class="chart-card">
          <div class="card-head">销售趋势（可切换日/周/月）</div>
          <div class="range-switch">
            <button :class="['btn','small', { active: range === 'day' }]" @click="setRange('day')">日</button>
            <button :class="['btn','small', { active: range === 'week' }]" @click="setRange('week')">周</button>
            <button :class="['btn','small', { active: range === 'month' }]" @click="setRange('month')">月</button>
          </div>
          <div id="trend-chart" ref="chartRef" class="chart-placeholder">折线/面积图占位（后续用 ECharts 渲染）</div>
      </div>


        <div class="top-products-card">
          <div class="card-head">热销商品 Top 5</div>
          <div class="top-products-list">
            <div class="product-item" v-for="(product, index) in topProducts" :key="product.id">
              <div class="rank">{{ index + 1 }}</div>
              <div class="thumb" aria-hidden></div>
              <div class="meta">
                <div class="name">{{ product.name }}</div>
                <div class="stats">售出 <span class="num">{{ product.sales }}</span> 件</div>
              </div>
              <div class="bar"><i :style="{ width: product.percent + '%' }"></i></div>
            </div>
          </div>
        </div>

        <div class="map-card">
          <div class="card-head">订单分布地图</div>
          <div id="map" class="map-placeholder">地图占位（后续用 Leaflet/Mapbox）</div>
        </div>

        <div class="list-card">
          <div class="card-head">最近订单</div>
          <div class="list-placeholder">
            <table class="mini-table">
              <thead>
                <tr><th>订单号</th><th>用户</th><th>金额</th><th>状态</th></tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td>¥{{ order.amount.toLocaleString() }}</td>
                  <td><span :class="['status-badge', order.statusColor]">{{ order.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>



    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats, getDashboardChart, getDashboardRank } from '@/api/dashboard'

let chart = null
let mapChart = null

const chartRef = ref(null)
const range = ref('day')

// 统计数据
const stats = ref({
  sales: { title: '总销售额', value: '—', trend: '', note: '' },
  orders: { title: '订单总数', value: '—', trend: '', note: '' },
  users: { title: '新增用户', value: '—', trend: '', note: '' },
  conversion: { title: '转化率', value: '—', trend: '', note: '' }
})

// 图表数据
const chartData = ref({
  x: [],
  series: []
})

// 热销商品
const topProducts = ref([])

// 最近订单
const recentOrders = ref([])

const ordersByProvince = {
  '北京市': 320,
  '上海市': 280,
  '广东省': 980,
  '浙江省': 450,
  '江苏省': 600,
  '山东省': 420,
  '河南省': 300,
  '湖北省': 260,
  '四川省': 310,
  '河北省': 180,
  '湖南省': 200,
  '福建省': 150,
  '重庆市': 90,
  '云南省': 80,
  '广西壮族自治区': 70,
  '安徽省': 140,
  '江西省': 110,
  '辽宁省': 95,
  '黑龙江省': 60,
  '吉林省': 55,
  '内蒙古自治区': 45,
  '山西省': 50,
  '陕西省': 65,
  '贵州省': 40
}

// 加载统计数据
async function loadStats() {
  try {
    const res = await getDashboardStats()
    stats.value = res.data
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载图表数据
async function loadChartData(type = 'day') {
  try {
    const res = await getDashboardChart(type)
    chartData.value = res.data
    updateChartData()
  } catch (error) {
    console.error('加载图表数据失败:', error)
  }
}

// 加载排行数据
async function loadRankData() {
  try {
    const res = await getDashboardRank()
    topProducts.value = res.data.topProducts || []
    recentOrders.value = res.data.recentOrders || []
  } catch (error) {
    console.error('加载排行数据失败:', error)
  }
}

function getOption(data) {
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 12, right: 12, top: 40, bottom: 24 },
    xAxis: {
      type: 'category',
      data: data.x,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e6e9ef' } }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.12 },
        lineStyle: { width: 2 },
        itemStyle: { color: '#10b981' },
        data: data.series
      }
    ]
  }
}

function makeMapData() {
  const src = typeof ordersByProvince === 'object' && ordersByProvince ? ordersByProvince : {}
  const arr = Object.keys(src).map((name) => ({ name, value: src[name] || 0 }))
  return arr
}

function getMapOption() {
  const data = makeMapData()
  const values = data.map(d => d.value).filter(v => typeof v === 'number')
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  return {
    title: {
      text: '订单分布（省级）',
      left: 12,
      top: 6,
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const v = params.value ? params.value : 0
        return `${params.name}<br/>订单数：${v}`
      }
    },
    visualMap: {
      min: Math.max(0, min),
      max: Math.max(10, max),
      left: 'right',
      top: 'center',
      text: ['高','低'],
      calculable: true,
      inRange: {
        color: ['#e6f7ff', '#90e0ff', '#00aaff', '#0077cc']
      },
      textStyle: { color: '#4b5563' }
    },
    series: [
      {
        name: '订单数',
        type: 'map',
        map: 'china',
        roam: true,
        emphasis: {
          label: { show: true, color: '#000' },
          itemStyle: { areaColor: '#ffd666' }
        },
        data
      }
    ]
  }
}

// 初始化并渲染地图（会在需要时从在线加载中国 GeoJSON 并注册）
async function initMap() {
  const el = document.getElementById('map')
  if (!el) return
  try {
    // 如果已注册就直接 init
    if (!echarts.getMap || !echarts.getMap('china')) {
      // 推荐在构建环境把 geoJSON 放到本地并替换下面的 URL，以免运行时依赖网络
      const url = 'https://geo.datav.aliyun.com/areas/bound/100000_full.json'
      const res = await fetch(url)
      const geoJson = await res.json()
      echarts.registerMap('china', geoJson)
    }
  } catch (e) {
    // 如果加载地图失败，仍然尝试初始化（可能会报错）
    console.warn('加载中国 GeoJSON 失败：', e)
  }
  mapChart = echarts.init(el)
  mapChart.setOption(getMapOption())
}
// 简单防抖
function debounce(fn, wait = 150) {
  let t = null
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

function resizeChart() {
  chart?.resize()
  mapChart?.resize()
}
const debouncedResize = debounce(resizeChart, 150)

async function setRange(r) {
  if (range.value === r) return
  range.value = r
  await loadChartData(r)
}

function updateChartData() {
  if (chart && chartData.value.x && chartData.value.series) {
    chart.setOption(getOption(chartData.value), { notMerge: false })
  }
}

onMounted(async () => {
  // 加载所有数据
  await Promise.all([
    loadStats(),
    loadChartData('day'),
    loadRankData()
  ])

  // 初始化图表
  const el = chartRef.value || document.getElementById('trend-chart')
  if (el) {
    chart = echarts.init(el)
    updateChartData()
  }

  // 初始化地图
  initMap()

  window.addEventListener('resize', debouncedResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedResize)
  chart?.dispose()
  mapChart?.dispose()
})

watch(chartData, () => {
  updateChartData()
}, { deep: true })


</script>

<style lang="scss" scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  padding: 18px;
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-title {
  margin: 0;
  font-size: 20px;
}
.subtitle {
  color: #9aa4b2;
  font-size: 13px;
  margin-top: 4px;
}
.header-left {
  display:flex;
  flex-direction:column;
}
.header-actions .btn.small {
  padding:6px 10px;
  font-size:13px;
}

.kpi-row {
  display:flex;
  gap:12px;
  margin-bottom:16px;
}
.kpi-card {
  flex: 1 1 0;
  background: #fff;
  padding: 12px 14px;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.06);
}

.kpi-title {
  font-size:13px;
  color:#6b7280;
}

.kpi-value {
  font-size:20px;
  font-weight:700;
  margin-top:6px;
}

.kpi-note {
  font-size:12px;
  color:#9aa4b2;
  margin-top:6px;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  grid-template-rows: 1fr 1fr;
  grid-auto-rows: minmax(0, 1fr);
  gap: 12px;
  flex: 1 1 auto;
  min-height: 0;
}

.chart-card, .list-card, .map-card, .top-products-card {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(2,6,23,0.06);
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.card-head {
  font-weight:600;
  margin-bottom:10px;
}
.chart-card {
  position: relative;
}
.range-switch {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  z-index: 5;
}
.range-switch .btn {
  border: 1px solid #e6e9ef;
  background: #fff;
  color: #4b5563;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.range-switch .btn.small { padding:6px 10px; }
.range-switch .btn.active {
  background: #10b981;
  color: #fff;
  border-color: rgba(16,185,129,0.9);
}
.chart-placeholder {
  /* fill available vertical space inside chart-card */
  flex: 1 1 auto;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9aa4b2;
  background: linear-gradient(180deg, #fbfdff, #ffffff);
  border-radius: 6px;
}

.side-column {
  display:flex;
  flex-direction:column;
  gap:12px;
}
.mini-table {
  width:100%;
  border-collapse:collapse;
  font-size:13px;
}
.mini-table th, .mini-table td {
  padding:8px 6px;
  text-align:left;
  border-bottom:1px solid #eef2f6;
}
.map-placeholder {
  flex: 1 1 auto;
  min-height: 160px;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#9aa4b2;
  background:#fafafa;
  border-radius:6px;
}


.top-products-card {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(2,6,23,0.04);
}
.top-products-list {
  display:flex;
  flex-direction:column;
  gap:8px;
}
.product-item {
  display:flex;
  align-items:center;
  gap:10px;
  padding:8px 4px;
}
.product-item .rank {
  width:28px;
  text-align:center;
  color:#6b7280;
  font-weight:700;
}
.product-item .thumb {
  width:40px;
  height:40px;
  border-radius:6px;
  background: linear-gradient(135deg,#f3f7fb,#ffffff);
  border:1px solid #eef6fb;
}
.product-item .meta {
  flex:1 1 auto;
}
.product-item .thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: linear-gradient(135deg, #f3f7fb, #ffffff);
  border: 1px solid #eef6fb;
}
.product-item .meta {
  flex: 1 1 auto;
}
.product-item .name {
  font-size: 13px;
  color: #111827;
}
.product-item .stats {
  color: #9aa4b2;
  font-size: 12px;
}
.product-item .bar {
  width: 60px;
  height: 8px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
}
.product-item .bar i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #0066cc);
}

.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}
.status-badge.success {
  background: #d1fae5;
  color: #065f46;
}
.status-badge.primary {
  background: #dbeafe;
  color: #1e40af;
}
.status-badge.warning {
  background: #fef3c7;
  color: #92400e;
}
.status-badge.info {
  background: #e0e7ff;
  color: #3730a3;
}

</style>
