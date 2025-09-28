<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const collapsed = ref(false)
const route = useRoute()

const nav = [
  { name: '仪表盘', path: '/' },
  { name: '分类管理', path: '/category' },
  { name: '商品管理', path: '/products' },
  { name: '会员管理', path: '/guest' },
  { name: '订单管理', path: '/order' },
  { name: '库存管理', path: '/inventory' },
  { name: '促销管理', path: '/promotions' },
  { name: '评价管理', path: '/reviews' },
  { name: '物流管理', path: '/shipping' },
  { name: '报表统计', path: '/analytics' },
  { name: '系统管理', path: '/system' },
  { name: '登录', path: '/login' }
]

function abbrev(name) {
  return name ? name.charAt(0) : ''
}

</script>

<template>
  <div class="layout">
    <aside class="sidebar" :class ="{ collapsed }">
      <div class="brand">
        <span class="title" v-if="!collapsed">商城后台管理系统</span>
        <button class="toggle" @click="collapsed = !collapsed" aria-label="Toggle menu">☰</button>
      </div>
      <nav class="nav">
        <ul>
          <li
          v-for="item in nav" :key="item.name"
          :class="{ active: route.path === item.path}"
          >
            <router-link
            :to="item.path"
            class="nav-link"
            >
              <span class="icon" v-show="collapsed" aria-hidden="true">{{ abbrev(item.name) }}</span>
              <span v-if="!collapsed" class="label">{{ item.name }}</span>

            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
:root {
  --sidebar-bg: #121417;
  --sidebar-accent: #1f2933;
  --active-bg: #409eff;
  --text: #e6eef6;
  --muted: rgba(255,255,255,0.6);
}

.layout {
  display: flex;
  height: 100vh;
  margin: 0;
  font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

/* 侧栏 */
.sidebar {
  width: 240px;
  background: linear-gradient(180deg,var(--sidebar-bg), var(--sidebar-accent));
  color: var(--text);
  display: flex;
  flex-direction: column;
  transition: width 200ms ease;
  box-shadow: 2px 0 8px rgba(0,0,0,0.12);
}
.sidebar.collapsed {
  width: 72px;
}

/* 品牌区 */
.brand {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-mark {
  background: linear-gradient(135deg,#ff8a00,#ff3d00);
  color: #fff;
  padding: 6px 8px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 13px;
}

/* 切换按钮 */
.toggle {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 18px;
  padding: 6px;
}
.toggle:hover { color: var(--text); }

/* 导航 */
.nav {
  padding: 8px 6px;
  overflow: auto;
  flex: 1;
}
.nav ul {
  list-style: none;
  padding: 6px;
  margin: 0;
}
.nav li {
  margin-bottom: 6px;
  border-radius: 6px;
  transition: background 180ms ease, transform 120ms ease;
}
.nav li:hover { transform: translateX(4px); }

/* 当前激活项 */
.nav li.active {
  background: linear-gradient(90deg, rgba(64,158,255,0.14), rgba(64,158,255,0.06));
  box-shadow: inset 3px 0 0 var(--active-bg);
}

/* 链接 */
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
  padding: 10px 12px;
  width: 100%;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
}
.nav-link:focus {
  outline: 2px solid rgba(64,158,255,0.18);
  outline-offset: 2px;
}

/* 图标缩写 */
.icon {
  width: 36px;
  height: 36px;
  min-width: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
  color: var(--text);
  font-weight: 700;
  font-size: 14px;
}

/* 标签文字 */
.label {
  font-size: 14px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 底部信息 */
.footer {
  padding: 12px;
  border-top: 1px dashed rgba(255,255,255,0.02);
  font-size: 12px;
  color: var(--muted);
}

/* 主区域 */
.main {
  flex: 1;
  background: #f5f8fb;
  overflow: auto;
  padding: 20px;
  min-width: 0;
}

/* 折叠样式微调 */
.sidebar.collapsed .label { display: none; }
.sidebar.collapsed .logo-mark { padding: 6px; font-size: 12px; }

.sidebar.collapsed .nav {
  align-items: center;
}
.sidebar.collapsed .nav ul {
  width: 100%;
  padding: 6px 0;
}
.sidebar.collapsed .nav li {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 8px 6px;
  width: auto;
}
.sidebar.collapsed .icon { width: 40px; height: 40px; border-radius: 8px; }
.collapsed .toggle{ padding-left: 17px;}
/* 响应式：窄屏自动折叠 */
/* @media (max-width: 800px) {
  .sidebar { position: absolute; z-index: 50; transform: translateX(-100%); }
  .sidebar.collapsed { transform: translateX(0); }
} */
</style>


