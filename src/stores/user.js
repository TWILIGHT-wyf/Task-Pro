import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo as getUserInfoApi } from '@/api/user.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.userInfo?.username || state.userInfo?.name || ''
  },

  actions: {
    /**
     * 用户登录
     * @param {Object} loginForm - 登录表单数据
     */
    async login(loginForm) {
      try {
        const res = await loginApi(loginForm)

        // 保存 token
        this.token = res.data.token || res.token
        localStorage.setItem('token', this.token)

        // 登录成功后立即获取用户信息
        await this.getUserInfo()

        return res
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },

    /**
     * 获取用户信息
     */
    async getUserInfo() {
      try {
        const res = await getUserInfoApi()
        this.userInfo = res.data || res
        return res
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果获取用户信息失败，清除 token
        this.logout()
        throw error
      }
    },

    /**
     * 用户退出登录
     */
    logout() {
      // 清空 state
      this.token = ''
      this.userInfo = null

      // 清空 localStorage
      localStorage.removeItem('token')
    }
  }
})
