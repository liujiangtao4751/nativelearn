# 原习 NativeLearn

面向小学孩子的学习陪伴 PWA 原型，覆盖练字、英语、数学、日记、积分与家长端。

## 本地运行

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## GitHub Pages

仓库推送到 GitHub 后，`.github/workflows/deploy-pages.yml` 会在 `main` 分支更新时自动构建并发布到 GitHub Pages。

如果第一次发布没有生成链接，到仓库的 `Settings -> Pages` 确认发布源使用 `GitHub Actions`。
