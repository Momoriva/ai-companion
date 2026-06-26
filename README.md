# AI Companion White Template

AI Companion 白胚网站，保留完整功能，默认 UI 为普通浅蓝白风格。适合复制后给不同客户二次配置交付。

## 已包含功能

- Home：首页、头像、名称、Together Days、今日寄语、最近动态
- Chat：AI 聊天、历史记录、自动滚动、打字动画、手机端优先
- Moments：动态列表，预留图片和点赞
- Memory：结构化记忆管理、搜索、筛选、添加、pin、归档/恢复
- Profile：头像、名称、bio、persona、世界观设定
- Supabase：用户、消息、动态、记忆、纪念日、日记知识库、向量 chunks
- OpenRouter：模型通过环境变量切换，不写死 Claude/GPT/Gemini
- 记忆系统：主动浮现、V/A/importance、日记 source 追溯、pgvector 预留
- 主题系统：默认 `blue` 浅蓝白，可继续扩展主题

## 客户定制入口

交付新客户时，优先只改这些地方：

- `config/site.json`
- `public/avatar.svg` 或新增客户头像图片
- Supabase 数据表里的 `moments`、`memories`、`anniversaries`
- `.env.local` 中的 Supabase / OpenRouter 配置

默认配置示例：

```json
{
  "name": "AI Companion",
  "avatar": "/avatar.svg",
  "theme": "blue",
  "anniversary": "2026-01-01",
  "welcome": "欢迎回来",
  "bio": "一个可配置、可记忆、可长期陪伴用户的 AI 伴侣。",
  "tagline": "轻量、稳定、可商用的 AI Companion 白胚。",
  "dailyMessages": ["今天也可以从一句简单的问候开始。"],
  "persona": "这是一个白胚 persona。",
  "worldview": "这是一个白胚世界观。"
}
```

## 本地运行

```bash
npm install
npm run dev
```

打开：

```txt
http://localhost:3000
```

手机预览：

```bash
npm run dev -- -H 0.0.0.0 -p 3000
```

然后手机访问 Mac 的局域网 IP，例如：

```txt
http://192.168.x.x:3000
```

## 环境变量

复制 `.env.example` 为 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
EMBEDDING_MODEL=openai/text-embedding-3-small
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=AI Companion Website
```

## Supabase

在 Supabase SQL Editor 执行：

```sql
-- supabase/schema.sql
```

## API

- `POST /api/chat`
- `GET/POST/PUT/DELETE /api/memories`
- `GET/POST/DELETE /api/knowledge`
- `POST /api/digest`

## 部署

1. 推送到 GitHub。
2. Vercel 新建项目，选择 Next.js。
3. 添加环境变量。
4. Supabase 执行 `supabase/schema.sql`。
5. Deploy。
