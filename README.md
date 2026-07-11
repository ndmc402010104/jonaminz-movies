# Jonaminz Movies

Jonathan 與 Minz 的電影討論、想看清單與訂票小工具（MVP demo）。

原始 UI 由 ChatGPT Work 產出（2026-07-11 approved 的互動 MVP snapshot），
用的是 OpenAI 自家的 `vinext`／site-creator 鷹架（Next.js + Cloudflare
Workers + D1）。這份 repo 已拆掉那套鷹架，只保留畫面本身，改成單純的
**Vite + React 19 + Tailwind v4** SPA，部署到 GitHub Pages（跟
[jonaminz](https://github.com/ndmc402010104/jonaminz) 本身一致）。

## 內含

- 近期上映與即將上映電影
- Jonathan / Minz 各自的想看意向
- 互相詢問、討論留言
- 想看清單、票券、觀影紀錄
- 場次選擇與電子票券 demo
- Calendar 能力接入 demo（實際串接由 jonaminz 平台的 Calendar 服務處理，
  Movies 不綁定特定服務）
- 目前只有 demo 資料，沒有接真實資料庫或第三方 API

## 本機開發

需要 Node.js 22+。

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## Platform Integration

這是 [jonaminz](https://github.com/ndmc402010104/jonaminz) Platform
Integration（圖書館模型）的第一個真實外部專案。根目錄的
`jonaminz.contract.json` 依照
[Contract JSON Schema](https://github.com/ndmc402010104/jonaminz/tree/main/docs/contract-schema)
撰寫；jonaminz 端在 `backend/cloudflare-worker/integration-settings.json`
登記本專案在各 environment 的 origin。

## 部署

`main` 分支 push 後由 `.github/workflows/deploy.yml`（GitHub Actions）
自動建置並部署到 GitHub Pages，網址：
`https://ndmc402010104.github.io/jonaminz-movies/`。

## 後續

demo 資料之後要漸進換成真實服務（電影資料來源、場次、票務），保留現有的
視覺語言與互動方式，只替換資料層。
