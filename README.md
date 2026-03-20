# 轨迹-基于AIGC的数据可视化平台（trajectory-next）

## 功能
- 账号与认证：支持 GitHub / 邮箱验证码登录，登录成功后将 token 写入 `localStorage`。
- 个人中心：个人信息、账号设置（编辑资料、上传头像）。
- 通知中心：基于 WebSocket 实时推送通知；认证失败会导致连接关闭。
- AI 页面入口：`/ai`、`/ai/[id]` 进行智能分析与展示（调用后端网关接口）。

## 环境变量
编辑 `./.env.production`：
- `NEXT_PUBLIC_API_BASE_URL`：后端网关地址，例如 `http://<host>:8080/api`
- `NEXT_PUBLIC_WS_PORT`：WebSocket 端口，例如 `9091`（前端会按 `协议+主机+端口+/websocket` 连接）

注意：`NEXT_PUBLIC_*` 会在构建阶段烘焙进前端代码，因此 Docker 镜像构建前必须先改好 `.env.production`。

## Docker 部署
1. 进入目录构建并启动
```bash
cd trajectory-next
docker compose up -d --build
```
2. 访问
`http://localhost:3000`
