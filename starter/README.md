# 光影志 · 独立摄影作品集

离线可演示的摄影师作品集（React + TypeScript + Vite + react-router-dom）。
所有照片与文案来自工作区 `mock-data/photos.json`（原样拷贝至 `src/data/photos.json`，
照片文件拷贝至 `public/photos/`），字体为 `assets/fonts/` 下的本地 woff2（拷贝至
`public/fonts/`），页面运行期间不请求任何外部字体 CDN。

## 启动

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

## 页面

- `/` 封面：Hero 简介 + 三个系列精选预览
- `/work` 片库：全部 14 张，按 肖像 / 风光 / 牧野 筛选
- `/work/:seriesId` 主题长页：图文交替 + 斜体引言，照片按 `order` 排序
- `/about` 作者简介与时间线
- `/contact` 约拍表单（行内校验、禁用提交、发送后感谢页）

## 关键设计

- 筛选状态保存在路由层的 `FilterContext`，进入长页再返回仍保留所选题材。
- 灯箱是唯一的全局组件（`LightboxContext` + `Lightbox`），封面、片库、长页三处的片图
  都打开它；左右切换只围绕打开时传入的那一组循环，计数显示「题材 · n / 组内总数」。
- 每张图在解码前按 `photos.json` 的 `width/height` 以 `aspect-ratio` 撑住版面，避免 CLS。
- 窄屏（≤720px）片库切单列、导航变汉堡菜单，灯箱说明移到画面下方。

## 浏览器自测

```bash
node e2e-verify.mjs   # 需先 npm run dev；覆盖 7 条约束的 Playwright 实测
```
