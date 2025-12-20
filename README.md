# Task-Pro（电商后台管理系统）

基于 Vue 3 + Vite 的电商后台管理系统练习项目，覆盖「商品 / 分类 / 订单 / 库存 / 促销 / 评价 / 物流 / 数据分析 / 系统管理」等典型模块，内置 Mock 数据与通用表格能力，支持本地零后端开发。

## 功能概览

- 业务模块：仪表盘、商品、分类、会员、订单、库存、促销、评价、物流、系统
- 数据分析：ECharts + vue-echarts，多图表联动，支持「今日/本周/本月/本年」切换
- 通用表格：列配置驱动 + 插槽扩展，支持选择/批量操作/导入导出（CSV/XLSX）
- 权限路由：登录态校验 + 角色鉴权（部分页面对角色限制）
- Mock 联调：vite-plugin-mock + /mock 数据文件（开发环境默认开启）

## 技术栈

- Vue 3（Composition API）/ Vue Router 4 / Pinia
- Element Plus（含中文语言包）
- Axios（封装于 request 工具）
- ECharts + vue-echarts
- Vite 7 + vite-plugin-mock
- 工具：file-saver、papaparse、xlsx
- 测试：Vitest、@vue/test-utils、JSDOM

Node 版本要求：`^20.19.0 || >=22.12.0`（见 package.json `engines`）

## 快速开始

安装依赖：

```powershell
npm install
```

开发启动（默认启用本地 Mock）：

```powershell
npm run dev
```

构建 / 预览：

```powershell
npm run build
npm run preview
```

代码检查 / 测试：

```powershell
npm run lint
npm run test
```

## 默认账号

本项目内置 Mock 登录：

- 用户名：`demo`
- 密码：`demo`

登录成功后会将 token 写入 localStorage 的 `token`，并在后续请求头中自动带上 `Authorization: Bearer <token>`。

## 路由与权限

路由结构：

- 常量路由：`/login`、`/register`、`/403`、`/`（Dashboard）
- 业务路由：分类、商品、会员、订单、库存、促销、评价、物流、数据分析、系统管理（作为动态路由按角色过滤注入）

角色限制（基于路由 meta.roles）：

- `/analytics`：仅 `admin`、`analyst`
- `/system`：仅 `admin`

实现位置：见 [src/router/index.js](src/router/index.js)。

## Mock 与接口约定

### Mock 机制

- Mock 数据目录：`/mock/*`（categories、products、orders、inventory、reviews、shippings、user 等）
- 开发环境：默认启用（见 [vite.config.js](vite.config.js) 中 `localEnabled: true`）
- 生产预览：默认关闭（`prodEnabled: false`）。如需开启：将其改为 `true`，并确保注入 [mockProdServer.js](mockProdServer.js) 的 `setupProdMockServer()`

### 请求封装

封装文件：见 [src/utils/request.js](src/utils/request.js)

- 自动添加 Authorization
- 兼容后端“信封结构”响应：`{ code, message, data }`（当 `code` 非 `0/200` 时视为失败并 reject）
- 对二进制响应（导出）直接返回 Blob
- 提供登录过期回调：`setOnAuthExpired({ redirect })`

### API 组织

- API 入口： [src/api/index.js](src/api/index.js)
- 业务 API：`src/api/*.js`（例如商品：`/api/products`，支持列表/详情/新增/更新/删除/批量/导出等 REST 风格端点）

如需对接真实后端：设置环境变量 `VITE_API_BASE_URL`（或在 request 中改 baseURL），并关闭 Mock。

## 目录结构（节选）

```
.
├─ mock/                    # 本地模拟数据与接口
├─ public/
└─ src/
   ├─ api/                  # API 封装（按业务拆分）
   ├─ components/           # 通用组件（表格、分页、弹窗、搜索等）
   ├─ composables/          # 组合式能力（如 useTableOperations）
   ├─ layout/               # 基础布局（侧边栏 + 主内容区）
   ├─ router/               # 路由与权限
   ├─ stores/               # Pinia（用户态等）
   ├─ styles/               # 全局样式
   ├─ utils/                # 工具函数（format/request 等）
   └─ view/                 # 页面模块
```

## 关键实现说明

### 通用表格（组件 + 组合式）

- 表格组件： [src/components/CustomTable.vue](src/components/CustomTable.vue)

  - 列配置渲染（`headers`）
  - 默认单元格渲染器（图片/头像/标签/状态等），也支持插槽覆盖
  - 内置多选、操作列（查看/编辑/删除确认）

- 表格操作组合式： [src/composables/useTableOperations.js](src/composables/useTableOperations.js)
  - CRUD、分页、搜索、筛选、排序
  - 批量操作：batchDelete / batchEnable / batchDisable
  - 导出：CSV（papaparse）/ XLSX（xlsx）
  - 并发控制与请求取消（避免重复请求造成数据回滚）

### 数据分析（ECharts）

文件： [src/view/AnalyticsView.vue](src/view/AnalyticsView.vue)

- 时间范围切换：today/week/month/year
- 图表：销售趋势、品类占比、订单状态分布、访问量趋势 + TOP 排行

## FAQ

- Node 版本不匹配：按 `engines` 安装 Node `^20.19.0` 或 `>=22.12.0`
- 图表空白：确认容器有高度、页面可见，切换范围后数据更新；检查控制台报错
- 接真实后端 CORS：后端开启跨域或在 Vite 中配置 `server.proxy`

## License

项目用于学习与演示目的；如需对外发布，请自行补充 LICENSE 并确认依赖许可。
