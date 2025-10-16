<template>
  <div class="system-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">系统设置</h1>
        <div class="subtitle">系统管理 — 系统配置</div>
      </div>
    </header>

    <!-- 设置卡片容器 -->
    <div class="settings-container">
      <!-- 基本设置 -->
      <div class="setting-card card-white">
        <div class="card-header">
          <h2 class="card-title">⚙️ 基本设置</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <label class="setting-label">网站名称</label>
            <input v-model="settings.siteName" type="text" class="setting-input" placeholder="请输入网站名称" />
          </div>
          <div class="setting-item">
            <label class="setting-label">网站标语</label>
            <input v-model="settings.siteSlogan" type="text" class="setting-input" placeholder="请输入网站标语" />
          </div>
          <div class="setting-item">
            <label class="setting-label">联系邮箱</label>
            <input v-model="settings.contactEmail" type="email" class="setting-input" placeholder="请输入联系邮箱" />
          </div>
          <div class="setting-item">
            <label class="setting-label">客服电话</label>
            <input v-model="settings.servicePhone" type="text" class="setting-input" placeholder="请输入客服电话" />
          </div>
        </div>
      </div>

      <!-- 业务设置 -->
      <div class="setting-card card-white">
        <div class="card-header">
          <h2 class="card-title">💼 业务设置</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <label class="setting-label">每页显示数量</label>
            <input v-model.number="settings.pageSize" type="number" class="setting-input" min="5" max="100" />
          </div>
          <div class="setting-item">
            <label class="setting-label">自动审核评论</label>
            <div class="setting-switch">
              <label class="switch">
                <input v-model="settings.autoApproveReviews" type="checkbox" />
                <span class="slider"></span>
              </label>
              <span class="switch-label">{{ settings.autoApproveReviews ? '已开启' : '已关闭' }}</span>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">低库存提醒阈值</label>
            <input v-model.number="settings.lowStockThreshold" type="number" class="setting-input" min="0" />
          </div>
          <div class="setting-item">
            <label class="setting-label">免运费金额</label>
            <input v-model.number="settings.freeShippingAmount" type="number" class="setting-input" min="0" step="0.01" />
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="setting-card card-white">
        <div class="card-header">
          <h2 class="card-title">🔔 通知设置</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <label class="setting-label">新订单通知</label>
            <div class="setting-switch">
              <label class="switch">
                <input v-model="settings.notifyNewOrder" type="checkbox" />
                <span class="slider"></span>
              </label>
              <span class="switch-label">{{ settings.notifyNewOrder ? '已开启' : '已关闭' }}</span>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">低库存通知</label>
            <div class="setting-switch">
              <label class="switch">
                <input v-model="settings.notifyLowStock" type="checkbox" />
                <span class="slider"></span>
              </label>
              <span class="switch-label">{{ settings.notifyLowStock ? '已开启' : '已关闭' }}</span>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">新评论通知</label>
            <div class="setting-switch">
              <label class="switch">
                <input v-model="settings.notifyNewReview" type="checkbox" />
                <span class="slider"></span>
              </label>
              <span class="switch-label">{{ settings.notifyNewReview ? '已开启' : '已关闭' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全设置 -->
      <div class="setting-card card-white">
        <div class="card-header">
          <h2 class="card-title">🔒 安全设置</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <label class="setting-label">会话超时时间(分钟)</label>
            <input v-model.number="settings.sessionTimeout" type="number" class="setting-input" min="5" max="1440" />
          </div>
          <div class="setting-item">
            <label class="setting-label">启用双因素认证</label>
            <div class="setting-switch">
              <label class="switch">
                <input v-model="settings.enableTwoFactor" type="checkbox" />
                <span class="slider"></span>
              </label>
              <span class="switch-label">{{ settings.enableTwoFactor ? '已开启' : '已关闭' }}</span>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">密码最小长度</label>
            <input v-model.number="settings.minPasswordLength" type="number" class="setting-input" min="6" max="32" />
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="btn-base btn-primary" @click="saveSettings">💾 保存设置</button>
        <button class="btn-base btn-secondary-outline" @click="resetSettings">🔄 重置设置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 系统设置数据
const settings = ref({
  // 基本设置
  siteName: 'Task-Pro 商城管理系统',
  siteSlogan: '专业的电商管理解决方案',
  contactEmail: 'support@taskpro.com',
  servicePhone: '400-888-8888',

  // 业务设置
  pageSize: 10,
  autoApproveReviews: false,
  lowStockThreshold: 10,
  freeShippingAmount: 99.00,

  // 通知设置
  notifyNewOrder: true,
  notifyLowStock: true,
  notifyNewReview: true,

  // 安全设置
  sessionTimeout: 30,
  enableTwoFactor: false,
  minPasswordLength: 8
})

// 默认设置（用于重置）
const defaultSettings = { ...settings.value }

// 保存设置
const saveSettings = () => {
  try {
    // 这里应该调用API保存设置
    localStorage.setItem('systemSettings', JSON.stringify(settings.value))
    alert('设置保存成功！')
  } catch (error) {
    console.error('保存设置失败:', error)
    alert('保存失败，请重试')
  }
}

// 重置设置
const resetSettings = () => {
  if (confirm('确定要重置所有设置为默认值吗？')) {
    settings.value = { ...defaultSettings }
    alert('设置已重置')
  }
}

// 从本地存储加载设置
const loadSettings = () => {
  try {
    const saved = localStorage.getItem('systemSettings')
    if (saved) {
      settings.value = { ...settings.value, ...JSON.parse(saved) }
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

// 初始化时加载设置
loadSettings()
</script>

<style lang="scss" scoped>
.system-page {
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

.settings-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.setting-card {
  padding: 20px;
}

.card-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.setting-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.setting-switch {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: #3b82f6;
    }

    &:checked + .slider:before {
      transform: translateX(24px);
    }
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
}

.switch-label {
  font-size: 14px;
  color: #6b7280;
}

.action-buttons {
  grid-column: 1 / -1;
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
}
</style>
