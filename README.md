# 洪都中学智慧校园平台 (HongDuCC)

南昌市洪都中学校园信息化 Web 应用，为师生提供新闻资讯、学习资源、论坛答疑、社交互动、社团管理等一站式服务。

> **当前状态**：正在从旧版单体应用（`HongDu/`）迁移至 pnpm monorepo 架构。旧版为功能完整的参考实现，新版正在逐步建设中。

## 技术栈

| 层级 | 旧版（参考实现） | 新版（开发中） |
|------|------------------|----------------|
| 前端框架 | Vue 3.5 (JS) | **Vue 3.5** (TypeScript, Composition API) |
| 构建工具 | Vite 7 | **Vite 8** |
| UI 组件库 | Naive UI | **Naive UI** |
| 状态管理 | Pinia 3 (composable) | **Pinia 4** (composable) |
| 路由 | Vue Router 5 | **Vue Router 4** |
| 后端框架 | Python FastAPI | **NestJS 11** |
| ORM / DB | SQLAlchemy + SQLite | **Prisma v7 + PostgreSQL** |
| 认证 | 自定义 JWT (HS256) | **JWT (Passport + bcrypt)** |
| 包管理 | npm | **pnpm** (workspace monorepo) |
| 共享类型 | — | **@hongducc/shared** |

## 项目结构

```
HongDuCC/
├── HongDu/                    # 旧版：完整功能参考实现（独立 npm 项目，非 workspace）
│   ├── src/                   #   Vue 3 SPA 源码
│   ├── backend/               #   Python FastAPI 后端
│   └── README.md              #   旧版架构文档
│
├── frontend/                  # 新版：Vue 3 + TypeScript + Vite 8 SPA（workspace 包）
│   ├── src/
│   │   ├── api/               #   API 请求模块
│   │   ├── components/        #   通用组件（TitleBar 等）
│   │   ├── composables/       #   组合式函数
│   │   ├── router/            #   路由配置 + 导航守卫
│   │   ├── stores/            #   Pinia 状态管理
│   │   └── views/             #   页面视图
│   └── package.json
│
├── backend/                   # 新版：NestJS + Prisma + PostgreSQL（workspace 包）
│   ├── prisma/
│   │   └── schema.prisma      #   数据库模型定义（16 张表）
│   ├── src/
│   │   ├── admin/             #   管理后台模块
│   │   ├── auth/              #   认证模块（JWT + Passport）
│   │   ├── clubs/             #   社团模块
│   │   ├── comments/          #   评论模块（多态关联）
│   │   ├── common/            #   公共工具（守卫、拦截器、装饰器）
│   │   ├── feeds/             #   动态模块
│   │   ├── forum/             #   论坛模块
│   │   ├── news/              #   新闻模块
│   │   ├── notifications/     #   通知模块
│   │   ├── reports/           #   举报模块
│   │   ├── resources/         #   学习资源模块
│   │   ├── social/            #   社交模块（关注）
│   │   ├── users/             #   用户模块
│   │   └── prisma/            #   Prisma 服务
│   └── package.json
│
├── packages/shared/           # 共享类型定义（@hongducc/shared）
│   └── src/
│
├── pnpm-workspace.yaml       # pnpm workspace 配置
├── package.json              # 根：monorepo 编排脚本
├── .gitignore
└── CLAUDE.md                 # Claude Code 项目指引
```

## 环境要求

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| **Node.js** | ≥ 20.19.0（或 ≥ 22.12.0） | JavaScript 运行时 |
| **pnpm** | ≥ 9 | 包管理器（workspace 支持） |
| **PostgreSQL** | ≥ 15 | 新版后端数据库 |
| **Python** | ≥ 3.10 | 仅旧版后端需要 |
| **Git** | ≥ 2.30 | 版本控制 |

## 快速开始

### 1. 克隆项目

```bash
git clone <repo-url>
cd HongDuCC
```

### 2. 安装依赖

```bash
# 安装所有 workspace 依赖（frontend + backend + shared）
pnpm install
```

### 3. 配置数据库

```bash
# 1. 确保 PostgreSQL 服务已启动
# 2. 创建数据库
createdb hongducc_db

# 3. 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env，填入数据库连接字符串：
# DATABASE_URL="postgresql://user:password@localhost:5432/hongducc_db"
```

```bash
# 4. 运行数据库迁移
cd backend
npx prisma migrate dev
npx prisma generate
```

### 4. 启动开发服务器

```bash
# 在项目根目录，同时启动前端和后端
pnpm dev

# 或者分别启动
pnpm dev:frontend   # Vite 开发服务器 → http://localhost:5173
pnpm dev:backend    # NestJS 开发服务器 → http://localhost:3000
```

启动后访问：

| 服务 | 地址 |
|------|------|
| 前端页面 | http://localhost:5173 |
| API 服务 | http://localhost:3000 |
| Prisma Studio（数据库管理） | `cd backend && npx prisma studio` |

## 开发方法

### 开发流程

1. **查阅参考实现**：在开发新版功能前，先查看 `HongDu/` 中对应的旧版实现，了解 UI 模式、API 格式和业务逻辑。
2. **定义共享类型**：在 `packages/shared/src/` 中定义前后端共用的接口/类型。
3. **后端先行**：在 `backend/src/<模块>/` 中实现 NestJS 模块（Controller → Service → Prisma 查询）。
4. **前端跟进**：在 `frontend/src/` 中创建页面视图、API 调用层和状态管理。
5. **联调验证**：确保 API 返回格式符合 `{ code: 0, message: "...", data: ... }` 规范。

### 常用命令

#### Monorepo（根目录）

```bash
pnpm install              # 安装所有 workspace 依赖
pnpm dev                  # 同时启动 frontend + backend 开发服务器
pnpm dev:frontend         # 仅启动前端
pnpm dev:backend          # 仅启动后端
```

#### 前端（`frontend/`）

```bash
pnpm --filter frontend dev        # 启动 Vite 开发服务器
pnpm --filter frontend build      # 类型检查 + 生产构建
pnpm --filter frontend preview    # 预览生产构建
```

#### 后端（`backend/`）

```bash
pnpm --filter backend start:dev   # 启动 NestJS 开发服务器（watch 模式）
pnpm --filter backend build       # 编译 TypeScript
pnpm --filter backend start:prod  # 运行生产构建
pnpm --filter backend test        # 运行单元测试
pnpm --filter backend test:e2e    # 运行端到端测试
pnpm --filter backend test:cov    # 测试覆盖率报告
pnpm --filter backend lint        # ESLint 代码检查
pnpm --filter backend format      # Prettier 格式化
```

#### 数据库操作（`backend/`）

```bash
cd backend
npx prisma studio           # 打开 Prisma Studio 可视化管理数据库
npx prisma migrate dev      # 根据 schema 变更生成并应用迁移
npx prisma migrate deploy   # 在生产环境应用迁移
npx prisma generate         # 重新生成 Prisma Client
npx prisma db seed          # 填充种子数据（如已配置）
```

### 旧版参考（`HongDu/`）

旧版是功能完整的独立应用。当新版某个功能不明确时，可启动旧版参考：

```bash
cd HongDu
npm install
npm run dev                   # 前端：http://localhost:5173

# 另一个终端
cd HongDu/backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload   # 后端：http://localhost:8000
```

### 代码风格

| 规则 | 说明 |
|------|------|
| 语言 | 前端统一 TypeScript，后端 NestJS + TypeScript |
| API 调用 | 前端通过 `src/api/` 模块封装，使用 Axios 实例 |
| 状态管理 | 使用 Pinia composable 模式（`useXxxStore()`），不用 `defineStore` |
| 组件风格 | Vue 3 Composition API + `<script setup lang="ts">` |
| 路由守卫 | `meta.requiresAuth` / `meta.requiresAdmin` |
| API 响应格式 | 统一返回 `{ code: number, message: string, data: any }` |

## API 响应规范

所有 API 端点统一返回以下格式：

```json
{
  "code": 0,
  "message": "操作成功",
  "data": { }
}
```

- `code: 0` 表示成功，非零值表示错误
- `message` 为人类可读的描述信息
- `data` 为实际的响应数据

## 核心业务模块

| 模块 | 路径前缀 | 说明 |
|------|----------|------|
| 认证 | `/api/auth` | 登录、注册、JWT 签发与验证 |
| 用户 | `/api/users` | 用户资料、主页、搜索 |
| 新闻 | `/api/news` | 校园新闻发布与管理 |
| 资源 | `/api/resources` | 学习资源上传、下载、点赞、收藏 |
| 论坛 | `/api/forum` | 帖子发布、分类、加精、评论 |
| 评论 | `/api/comments` | 多态评论系统（支持嵌套回复） |
| 动态 | `/api/feeds` | 社交动态发布与互动 |
| 社团 | `/api/clubs` | 社团创建、成员管理、活动 |
| 通知 | `/api/notifications` | 站内通知、未读计数 |
| 举报 | `/api/reports` | 内容举报与处理 |
| 管理 | `/api/admin` | 后台管理（仪表盘、用户/内容管理） |

## 数据库表

| 表名 | 用途 |
|------|------|
| `users` | 用户（学号、密码哈希、角色、积分） |
| `news` | 新闻资讯（软删除） |
| `resources` | 学习资源（文件信息、下载统计） |
| `resource_likes` | 资源点赞 |
| `forum_posts` | 论坛帖子（分类、话题、软删除） |
| `forum_likes` | 帖子点赞 |
| `comments` | 通用评论（多态关联 + 嵌套回复） |
| `feeds` | 社交动态（图片 JSON） |
| `feed_likes` | 动态点赞 |
| `follows` | 关注关系 |
| `notifications` | 站内通知 |
| `reports` | 举报记录 |
| `clubs` | 社团信息 |
| `club_members` | 社团成员 |
| `club_events` | 社团活动 |

## 部署

### 前端

```bash
pnpm --filter frontend build    # 输出到 frontend/dist/
# 部署 dist/ 到任意静态托管服务（Nginx、Cloudflare Pages、Vercel 等）
```

### 后端

```bash
pnpm --filter backend build     # 输出到 backend/dist/
# 使用 Node.js 运行
node backend/dist/main.js
# 或使用 PM2 / Docker 部署
```

## 相关文档

- [旧版 README](HongDu/README.md) — 旧版完整架构文档
- [CLAUDE.md](CLAUDE.md) — Claude Code 项目指引
- [旧版 CLAUDE.md](HongDu/CLAUDE.md) — 旧版代码库指引

---

**洪都中学智慧校园平台** — 为南昌洪都中学师生打造的校园信息化一站式服务平台。
