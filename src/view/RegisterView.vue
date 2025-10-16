<template>
  <div class="register-page" @keydown.enter.prevent="submit">
  <div class="register-card card" role="form" aria-label="注册表单">
      <div class="brand">

        <div class="title">创建账号</div>
      </div>

      <form class="form" @submit.prevent="submit">
        <div class="field">
          <label class="sr" for="reg-username">用户名</label>
          <input id="reg-username" name="username" type="text" placeholder="请输入用户名"
          v-model="form.username"
          />
        </div>

        <div class="field">
          <label class="sr" for="reg-email">邮箱</label>
          <input id="reg-email" name="email" type="email" placeholder="请输入邮箱"
          v-model="form.email"
          />
        </div>

        <div class="field">
          <label class="sr" for="reg-password">密码</label>
          <input id="reg-password" name="password" type="password" placeholder="请输入密码（至少 8 位）"
          v-model="form.password"
          />
        </div>

        <div class="field">
          <label class="sr" for="reg-confirm">确认密码</label>
          <input id="reg-confirm" name="confirm" type="password" placeholder="请再次输入密码"
          v-model="form.confirm"
          />
        </div>

        <div class="actions">
          <label class="agree">
            <input type="checkbox" name="agree" v-model="form.agree" />
            我已阅读并同意 服务条款
          </label>
          <button class="btn" type="submit" :disabled="loading" @click="submit">
            <span v-if="!loading">注册</span>
            <span v-else>注册中…</span>
          </button>
        </div>
         <p class="hint">已有账号？<a href="/login">去登录</a></p>
        <p class="message">{{message}}</p>
      </form>

      <footer class="note">建议使用真实邮箱用于找回密码</footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api'
const router = useRouter()
const message = ref('')
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  email: '',
  confirm: '',
  agree: false
})
// 验证器
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

async function submit() {
  message.value = ''
  if (!form.username) { message.value = '请输入用户名'; return }
  if (!form.email || !validateEmail(form.email)) { message.value = '请输入有效的邮箱地址'; return }
  if (!form.password || form.password.length < 8) { message.value = '密码至少 8 位'; return }
  if (form.password !== form.confirm) { message.value = '两次密码不一致'; return }
  if (!form.agree) { message.value = '请同意服务条款'; return }

  loading.value = true
  try {
    const res = await register({
      username: form.username,
      email: form.email,
      password: form.password,
      confirm: form.confirm
    })
    if (res.code === 0) {
      message.value = '注册成功，正在跳转到登录页…'
      setTimeout(() => router.push('/login'), 800)
    } else {
      message.value = res.message || '注册失败'
    }
  } catch (err) {
    message.value = err?.response?.data?.message || err.message || '网络错误'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f5f8fb, #ffffff);
  padding: 20px;
  box-sizing: border-box;
  font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

.register-card {
  width: 420px;
  max-width: 96%;
  background: linear-gradient(180deg, #ffffff, #fbfdff);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 36px rgba(2, 6, 23, 0.12);
  color: #0b1220;
}

/* 品牌区 */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.logo-mark {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #22c1c3, #fdbb2d);
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 6px 16px rgba(34, 193, 195, 0.12);
}
.title {
  font-size: 18px;
  font-weight: 700;
  color: #0f1724;
}

/* 表单 */
.form {
  display: grid;
  gap: 12px;
}
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
  border-color: #34d399;
  box-shadow: 0 6px 18px rgba(52,211,153,0.08);
}

/* 隐藏可访问标签 */
.sr { position: absolute !important; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden; }

/* 操作行 */
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}
.agree {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}
.btn {
  background: linear-gradient(90deg, #10b981, #06b6d4);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 6px 18px rgba(6, 182, 212, 0.12);
}
.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 辅助文本 */
.hint {
  font-size: 13px;
  color: #6b7280;
  margin-top: 6px;
}
.hint a { color: #409eff; text-decoration: none; }

/* 错误信息 */
.message {
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
</style>
