# Jonaminz Movies

Jonathan 與 Minz 的電影討論、想看清單與訂票小工具（MVP demo）。

原始 UI 由 ChatGPT Work 產出（2026-07-11 approved 的互動 MVP snapshot），
一開始用的是 OpenAI 自家的 `vinext`／site-creator 鷹架（Next.js + Cloudflare
Workers + D1，需要 npm install + 建置才能跑）。這份 repo 已經拆掉那整套，
改成**不需要任何建置工具**的純 HTML／CSS／JS：

- `index.html` 用 `<script>` 標籤直接從 CDN 載入 React／ReactDOM／
  Babel（在瀏覽器裡即時把 JSX 轉成 JavaScript）／Tailwind。
- `app.jsx` 是全部畫面邏輯，用 JSX 寫、不需要編譯步驟。
- `styles.css` 是外觀樣式。

## 本機開發

**不需要安裝任何東西**，直接用瀏覽器打開 `index.html` 就能看（雙擊檔案，
或用 VS Code 的 Live Server 都可以）。改 `app.jsx`／`styles.css`後存檔，
重新整理瀏覽器就會看到最新結果。

（唯一限制：因為 React／Babel／Tailwind 是從網路上的 CDN 載入，離線的時候
打不開；`index.html` 裡有寫這個取捨的原因。）

## 內含

- 近期上映與即將上映電影
- Jonathan / Minz 各自的想看意向
- 互相詢問、討論留言
- 想看清單、票券、觀影紀錄
- 場次選擇與電子票券 demo
- Calendar 能力接入 demo（實際串接由 jonaminz 平台的 Calendar 服務處理，
  Movies 不綁定特定服務）
- 目前只有 demo 資料，沒有接真實資料庫或第三方 API

## Platform Integration

這是 [jonaminz](https://github.com/ndmc402010104/jonaminz) Platform
Integration（圖書館模型）的第一個真實外部專案。根目錄的
`jonaminz.contract.json` 依照
[Contract JSON Schema](https://github.com/ndmc402010104/jonaminz/tree/main/docs/contract-schema)
撰寫；jonaminz 端在 `backend/cloudflare-worker/integration-settings.json`
登記本專案在各 environment 的 origin。這份 Contract 已經實際推送過一次，
jonaminz 資料庫裡有一筆對應的 pending 紀錄。

## 部署

`main` 分支 push 後 GitHub Pages 直接從分支內容部署（沒有建置步驟，
push 完幾乎立刻生效），網址：
`https://ndmc402010104.github.io/jonaminz-movies/`。

## 後續

demo 資料之後要漸進換成真實服務（電影資料來源、場次、票務），保留現有的
視覺語言與互動方式，只替換資料層。
