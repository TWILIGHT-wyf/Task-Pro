<template>
  <div class="login-page" @keydown.enter.prevent="submit">
    <div class="login-card" role="form" aria-label="登录表单">
      <div class="brand">
        <div class="title">商城后台管理系统</div>
      </div>

      <form class="form" @submit.prevent="submit">
        <div class="field">
          <label class="sr" for="username">用户名 / 邮箱</label>
          <input id="username" v-model="form.username" type="text" placeholder="请输入用户名或邮箱" />
        </div>

        <div class="field">
          <label class="sr" for="password">密码</label>
          <input id="password" v-model="form.password" type="password" placeholder="请输入密码" />
        </div>

        <div class="actions">
          <label class="remember">
            <input type="checkbox" v-model="form.remember" />
            记住我
          </label>
          <button class="btn" type="submit" :disabled="loading">
            <span v-if="!loading">登录</span>
            <span v-else>登录中…</span>
          </button>
        </div>

        <p class="error" v-if="error">{{ error }}</p>
        <p class="hint">没有账号？ <router-link to="/register">去注册</router-link></p>
      </form>

      <footer class="note">使用 demo 账号测试：demo / demo</footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const error = ref('')
const router = useRouter()
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  remember: true
})

async function submit() {
  error.value = ''
  if (!form.username || !form.password){
    error.value = '请输入用户名或密码'
    return
  }
  loading.value = true
  try {
    const res = await axios.post('/api/login', { username: form.username, password: form.password })
    if (res.data?.code === 0) {
      const token = res.data.data.token
      localStorage.setItem('token', token)
      router.push('/')

    } else {
      error.value = res.data?.message || '登录失败'
    }
  } catch (error) {
    console.error(error)
    error.value = '网络或服务器错误'
  } finally {
    loading.value = false
  }

}

</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg,#0f1724 0%, #0a1220 100%);
  padding: 20px;
  box-sizing: border-box;
  font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

/* 卡片 */
.login-card {
  width: 380px;
  max-width: 94%;
  background: linear-gradient(180deg,#ffffff,#fbfdff);
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 30px rgba(2,6,23,0.12);
  color: #0b1220;
}

/* 品牌区 */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.logo-mark {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg,#ff8a00,#ff3d00);
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 6px 16px rgba(255,77,0,0.12);
}
.title {
  font-size: 18px;
  font-weight: 700;
  color: #0f1724;
}

/* 表单 */
.form { display: grid; gap: 12px; }
.field input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e6e9ef;
  background: #fff;
  box-sizing: border-box;
  font-size: 14px;
  color: #0b1220;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.field input::placeholder { color: #9aa4b2; }
.field input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 6px 18px rgba(64,158,255,0.12);
}

/* 无障碍隐藏标签 */
.sr { position: absolute !important; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden; }

/* 操作行 */
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
}
.remember {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}
.btn {
  background: linear-gradient(90deg,#409eff,#2b90ff);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 6px 18px rgba(43,144,255,0.14);
}
.btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* 错误信息 */
.error {
  color: #e11d48;
  font-size: 13px;
  margin-top: 6px;
}

/* 底部说明 */
.note {
  margin-top: 14px;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

/* 响应式 */
/* @media (max-width: 420px) {
  .login-card { padding: 16px; width: 320px; }
  .logo-mark { width: 40px; height: 40px; font-size: 14px; }
} */
</style>
