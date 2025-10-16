# Task-Pro（电商后台管理系统）

> 基于 Vue 3 + Vite 的电商后台管理系统，包含商品、订单、评论、物流、数据分析与系统设置等模块，内置 Mock 数据与通用表格、数据可视化方案，适合作为应届/初级前端的综合练习与求职项目。

## ✨ 特性亮点

- 模块完整：商品、库存、订单、评论、物流、促销、用户、系统设置等常见后台模块
- 数据可视化：集成 ECharts，数据分析页支持「今日/本周/本月/本年」范围切换
- 通用表格：列配置驱动，支持多类型单元格、批量操作、导出 CSV/XLSX
- 工程化：Vite 构建、ESLint 规范、Vitest 测试、按需路由懒加载
- Mock 联调：vite-plugin-mock 提供完整本地数据，真实后端零依赖即可开发

## 🧱 技术栈

- 框架：Vue 3（Composition API）
- 路由：Vue Router 4
- 状态：Pinia
- UI 组件：Element Plus
- 可视化：ECharts + vue-echarts
- 网络：Axios
- 构建：Vite 7
- Mock：vite-plugin-mock + 本地模拟数据（`/mock`）
- 工具：file-saver、papaparse、xlsx
- 测试：Vitest、@vue/test-utils、JSDOM
- 代码规范：ESLint 9

Node 版本要求（来自 package.json engines）：`^20.19.0 || >=22.12.0`

## 📂 目录结构（节选）

```
.
├─ mock/                    # 各业务的本地模拟数据
├─ public/
└─ src/
	├─ api/                  # 接口封装（axios）
	├─ components/           # 通用组件（表格、分页、弹窗、搜索等）
	├─ composables/          # 组合式函数（如 useTableOperations）
	├─ router/               # 路由配置（懒加载）
	├─ stores/               # Pinia 状态
	├─ styles/               # 全局样式
	├─ utils/                # 工具函数（格式化、防抖节流等）
	└─ view/                 # 页面模块（Dashboard、Products、Orders、Analytics 等）
```

> 关键文件：

- `src/view/AnalyticsView.vue` 数据分析（ECharts、时间范围切换）
- `src/components/CustomTable.vue` 通用表格（列配置驱动、批量操作）
- `src/composables/useTableOperations.js` 表格增删改查、分页、导出等抽象
- `src/utils/format.js` 数字/货币/日期/百分比等通用格式化与防抖节流
- `src/api/*.js` 统一接口封装
- `mock/*.js` 业务 Mock 数据
- `src/router/index.js` 路由懒加载配置

## 🚀 快速开始

建议 IDE：VS Code + Volar（禁用 Vetur）

安装依赖：

```powershell
npm install
```

启动开发（默认启用本地 Mock）：

```powershell
npm run dev
```

生产构建：

```powershell
npm run build
```

本地预览构建产物：

```powershell
npm run preview
```

代码检查：

```powershell
npm run lint
```

单元测试：

```powershell
npm run test
```

## 🧪 Mock 数据说明

- 本地开发：已通过 `vite-plugin-mock` 启用（见 `vite.config.js`，`localEnabled: true`）。
- 生产环境：默认关闭（`prodEnabled: false`）。如需在生产预览中启用，可将其置为 `true`，并使用 `mockProdServer.js` 中的 `setupProdMockServer()`。

> 提示：接入真实后端时，仅需关闭 Mock，并在 `utils/request.js` 中配置真实 `baseURL` 与拦截器。

## 🧭 路由一览（节选）

- `/` Dashboard
- `/products` 商品管理
- `/category` 分类管理
- `/guest` 客户管理
- `/order` 订单管理
- `/inventory` 库存管理
- `/promotions` 促销管理
- `/reviews` 评论管理
- `/shipping` 物流管理
- `/analytics` 数据分析（ECharts）
- `/system` 系统设置
- `/login` 登录 / `/register` 注册

## 🧩 关键模块说明

### 数据分析（ECharts）

- 文件：`src/view/AnalyticsView.vue`
- 特性：四类图表（趋势、品类、状态、访问），支持「今日/周/月/年」切换，数据与图表联动更新。

### 通用表格（配置驱动）

- 文件：`src/components/CustomTable.vue`
- 特性：支持图片、状态徽章、价格、日期等多单元格类型；多选与批量操作；与 `useTableOperations` 解耦。

### 组合式函数（表格操作）

- 文件：`src/composables/useTableOperations.js`
- 特性：封装列表查询、分页、增删改、批量操作、导出 CSV/XLSX，支持注入自定义 API。

### 工具函数

- 文件：`src/utils/format.js`
- 特性：`formatNumber/formatCurrency/formatDate/formatPercent`、`debounce/throttle/deepClone` 等通用能力，统一显示规范。

## 🔧 常见问题（FAQ）

1. 启动报 Node 版本不匹配？

- 请安装 Node `^20.19.0` 或 `>=22.12.0`。

2. 图表不显示或空白？

- 确认容器有尺寸、页面可见、以及切换范围后有数据；检查控制台报错。

3. 接入真实后端出现 CORS？

- 在后端开启跨域或通过本地代理解决（可在 Vite 配置中添加 `server.proxy`）。

4. 构建后想保留 Mock 预览？

- 将 `vite.config.js` 中 `viteMockServe` 的 `prodEnabled` 设为 `true`，并确保引入 `setupProdMockServer()`。

## 📜 License

本项目用于学习与演示目的，未标注专用协议。如需对外发布，请自行补充 LICENSE 并确认依赖包授权条款。
