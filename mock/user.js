export default [
  {
    url: '/api/login',
    method: 'post',
    timeout: 300,
    response: ({ body }) => {
      const { username, password } = body || {}
      if (username === 'demo' && password === 'demo') {
        return { code: 0, data: { token: 'demo-token-123' } }
      }
      return { code: 401, message: '用户名或密码错误' }
    }
  },
  {
    url: '/api/user',
    method: 'get',
    response: ({ headers }) => {
      if ((headers.authorization || '') === 'Bearer demo-token-123') {
        return { code: 0, data: { id:1, username:'demo', name:'管理员', roles: ['admin', 'analyst'] } }
      }
      return { code: 401, message: '未登录' }
    }
  }
  ,
  {
    url: '/api/register',
    method: 'post',
    timeout: 300,
    response: ({ body }) => {
      const { username, email, password, confirm } = body || {}
      if (!username || !email || !password || !confirm) {
        return { code: 400, message: '请填写完整信息' }
      }
      if (password !== confirm) {
        return { code: 400, message: '两次密码不一致' }
      }
      // 简单示例：如果用户名是 demo 则认为已存在
      if (username === 'demo') {
        return { code: 409, message: '用户名已存在' }
      }
      // 返回模拟成功（不保存真实用户）
      return { code: 0, data: { id: Math.floor(Math.random()*10000)+1, username, email } }
    }
  },
  {
    url: '/api/user',
    method: 'put',
    response: ({ body, headers }) => {
      if ((headers.authorization || '') === 'Bearer demo-token-123') {
        return { code: 0, data: { id:1, username:'demo', name:'管理员', ...body } }
      }
      return { code: 401, message: '未登录' }
    }
  },
  {
    url: '/api/user/password',
    method: 'put',
    response: ({ body, headers }) => {
      if ((headers.authorization || '') === 'Bearer demo-token-123') {
        const { oldPassword, newPassword } = body || {}
        if (!oldPassword || !newPassword) {
          return { code: 400, message: '请填写完整信息' }
        }
        // 简单验证：假设旧密码是正确的
        return { code: 0, message: '密码修改成功' }
      }
      return { code: 401, message: '未登录' }
    }
  },
  {
    url: '/api/logout',
    method: 'post',
    response: ({ headers }) => {
      if ((headers.authorization || '') === 'Bearer demo-token-123') {
        return { code: 0, message: '退出成功' }
      }
      return { code: 401, message: '未登录' }
    }
  }
]
