# 妈妈的回忆小宇宙

一个手机优先的生日祝福网站：点击星图坐标，逐一打开照片回忆，最后展开祝福信。

## 替换内容

1. 把照片放进 `public/photos/`。
2. 在 `src/data/memories.js` 中替换每条回忆的 `image`、`date`、`title`、`note`。
3. 在同一文件的 `letter` 中替换最终信件。

图片地址示例：`/photos/memory-01.jpg`。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```
