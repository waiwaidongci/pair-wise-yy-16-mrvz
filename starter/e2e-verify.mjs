// 浏览器实测脚本（Playwright）：在真实交互中验证 task.md 的 7 条约束。
// 用法：先 `npm run dev`，再 `node e2e-verify.mjs`。
import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = 'http://127.0.0.1:5173'
const data = JSON.parse(fs.readFileSync(new URL('./src/data/photos.json', import.meta.url), 'utf8'))

let pass = 0
let fail = 0
function check(name, cond, extra = '') {
  if (cond) {
    pass++
    console.log(`  ✓ ${name}`)
  } else {
    fail++
    console.error(`  ✗ ${name} ${extra}`)
  }
}

const browser = await chromium.launch()
const errors = []

async function newPage() {
  const page = await browser.newPage()
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  return page
}

// ---------- 1. 五个路由均渲染 ----------
console.log('1) 路由渲染 / 无 console error')
{
  const page = await newPage()
  for (const route of ['/', '/work', '/work/highland-pastoral', '/about', '/contact']) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    check(`${route} 渲染 <main>`, await page.locator('main').count() === 1)
  }
  await page.close()
}

// ---------- 2. 筛选 UI + 筛选结果 ----------
console.log('2) 片库筛选')
{
  const page = await newPage()
  await page.goto(BASE + '/work', { waitUntil: 'networkidle' })
  const labels = await page.locator('.filters button').allTextContents()
  check('筛选按钮为 全部/肖像/风光/牧野', JSON.stringify(labels) === JSON.stringify(['全部', '肖像', '风光', '牧野']), JSON.stringify(labels))
  await page.getByRole('button', { name: '牧野' }).click()
  check('牧野筛选后 4 张', await page.locator('.photo-button').count() === 4)
  check('牧野按钮 aria-pressed=true',
    (await page.getByRole('button', { name: '牧野' }).getAttribute('aria-pressed')) === 'true')

  // ---------- 1-约束 筛选状态跨导航保持 ----------
  await page.getByRole('link', { name: /高原牧歌/ }).click()
  await page.waitForURL(/highland-pastoral/)
  await page.goBack()
  await page.waitForURL(/\/work$/)
  check('返回后牧野仍选中',
    (await page.getByRole('button', { name: '牧野' }).getAttribute('aria-pressed')) === 'true')
  check('返回后仍是 4 张牧野', await page.locator('.photo-button').count() === 4)
  await page.close()
}

// ---------- 2-约束 灯箱限定范围导航（三处入口同一个组件） ----------
console.log('3) 共享灯箱 + 组内循环')
{
  const page = await newPage()
  await page.goto(BASE + '/work', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '牧野' }).click()

  await page.locator('.photo-button').first().click()
  await page.locator('.lightbox[role="dialog"]').waitFor()
  const counterText = await page.locator('.lightbox-info .eyebrow').textContent()
  check('打开即显示 1 / 4', /1\s*\/\s*4/.test(counterText), counterText)

  const titles = []
  for (let i = 0; i < 4; i++) {
    titles.push((await page.locator('.lightbox-info h2').textContent()).trim())
    await page.getByRole('button', { name: '下一张' }).click()
  }
  const expected = data.photos.filter((p) => p.category === 'pastoral').map((p) => p.title)
  check('4 次下一张按序遍历牧野四幅', JSON.stringify(titles) === JSON.stringify(expected),
    `${JSON.stringify(titles)} vs ${JSON.stringify(expected)}`)
  const backAtFirst = (await page.locator('.lightbox-info h2').textContent()).trim() === expected[0]
  check('第 5 张循环回第 1 张', backAtFirst)
  const c2 = await page.locator('.lightbox-info .eyebrow').textContent()
  check('计数器分母始终为 4', /1\s*\/\s*4/.test(c2), c2)
  await page.getByRole('button', { name: '关闭' }).click()
  await page.locator('.lightbox[role="dialog"]').waitFor({ state: 'detached' })
  check('灯箱可关闭', await page.locator('.lightbox[role="dialog"]').count() === 0)

  // 首页精选、系列长页入口是否同一个灯箱根节点
  await page.goto(BASE + '/work/highland-pastoral', { waitUntil: 'networkidle' })
  await page.locator('.story .photo-button').first().click()
  check('系列长页打开同一灯箱', await page.locator('.lightbox[role="dialog"]').count() === 1)
  check('系列页灯箱分母为系列张数 4', /1\s*\/\s*4/.test(await page.locator('.lightbox-info .eyebrow').textContent()))
  await page.getByRole('button', { name: '关闭' }).click()

  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.locator('.series-card').first().click()
  check('首页精选卡片打开同一灯箱', await page.locator('.lightbox[role="dialog"]').count() === 1)
  check('首页灯箱分母为凝视 5', /1\s*\/\s*5/.test(await page.locator('.lightbox-info .eyebrow').textContent()))
  await page.close()
}

// ---------- 3-约束 图片宽高预留（CLS） ----------
console.log('4) 图片解码前按原始宽高占位')
{
  const page = await newPage()
  await page.route('**/*.jpg', async (route) => {
    await new Promise((r) => setTimeout(r, 900))
    await route.continue()
  })
  await page.goto(BASE + '/work', { waitUntil: 'domcontentloaded' })
  const p0 = data.photos[0]
  const box = await page.locator('.photo-button .ratio-box').first().boundingBox()
  const ratio = box.width / box.height
  check(`占位比例误差 <1%（${ratio.toFixed(4)} vs ${(p0.width / p0.height).toFixed(4)}）`,
    Math.abs(ratio - p0.width / p0.height) < 0.01)

  const before = await page.locator('.photo-button').nth(1).boundingBox()
  await page.waitForLoadState('networkidle')
  const after = await page.locator('.photo-button').nth(1).boundingBox()
  check('图片加载后相邻元素位移 <1px', Math.abs(before.y - after.y) < 1, `${before.y} -> ${after.y}`)
  await page.close()
}

// ---------- 4-约束 系列页顺序由数据派生 ----------
console.log('5) 系列长页数据与顺序')
{
  const page = await newPage()
  await page.goto(BASE + '/work/highland-pastoral', { waitUntil: 'networkidle' })
  const rendered = await page.locator('.story article h2').allTextContents()
  const expected = data.photos
    .filter((p) => p.seriesId === 'highland-pastoral')
    .sort((a, b) => a.order - b.order)
    .map((p) => p.title)
  check('长页标题顺序与 order 派生一致', JSON.stringify(rendered) === JSON.stringify(expected),
    `${JSON.stringify(rendered)} vs ${JSON.stringify(expected)}`)
  const summary = data.series.find((s) => s.id === 'highland-pastoral').summary
  check('summary 以斜体引言呈现', (await page.locator('.pull-quote').first().textContent()).includes(summary))
  await page.close()
}

// ---------- 5-约束 移动端单列 + 灯箱底部说明 ----------
console.log('6) 移动端响应式')
{
  const page = await newPage()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE + '/work', { waitUntil: 'networkidle' })
  const a = await page.locator('.photo-button').first().boundingBox()
  const b = await page.locator('.photo-button').nth(1).boundingBox()
  check('网格为单列（第二项在第一项下方）', b.y > a.y + a.height - 2)
  check('汉堡菜单可见', await page.locator('.menu').isVisible())

  await page.locator('.photo-button').first().click()
  await page.locator('.lightbox[role="dialog"]').waitFor()
  const img = await page.locator('.lightbox-image').boundingBox()
  const info = await page.locator('.lightbox-info').boundingBox()
  check('灯箱说明在画面下方', info.y >= img.y + img.height - 2, `img bottom=${img.y + img.height}, info y=${info.y}`)
  await page.close()
}

// ---------- 6-约束 离线字体 ----------
console.log('7) 离线字体，无 CDN 请求')
{
  const page = await newPage()
  const urls = []
  page.on('request', (r) => urls.push(r.url()))
  for (const route of ['/', '/work', '/about', '/contact']) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
  }
  check('无 googleapis/gstatic 请求', !urls.some((u) => /fonts\.googleapis\.com|fonts\.gstatic\.com/.test(u)))
  const localFonts = new Set(urls.filter((u) => u.includes('/fonts/') && u.endsWith('.woff2')))
  check(`本地 woff2 字体已加载（${localFonts.size} 个）`, localFonts.size >= 2, [...localFonts].join(', '))
  await page.close()
}

// ---------- 内容一致性 ----------
console.log('8) 内容来自 photos.json，无参考图混入')
{
  const page = await newPage()
  const urls = []
  page.on('request', (r) => urls.push(r.url()))
  await page.goto(BASE + '/work', { waitUntil: 'networkidle' })
  const titles = await page.locator('.photo-button .photo-meta strong').allTextContents()
  check('标题集合与 photos.json 完全一致',
    JSON.stringify([...titles].sort()) === JSON.stringify(data.photos.map((p) => p.title).sort()))
  const alts = await page.locator('.photo-button img').evaluateAll((els) => els.map((e) => e.alt))
  check('alt 集合与 photos.json 完全一致',
    JSON.stringify([...alts].sort()) === JSON.stringify(data.photos.map((p) => p.altText).sort()))
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.goto(BASE + '/work/highland-pastoral', { waitUntil: 'networkidle' })
  check('未请求任何 reference_* 参考图', !urls.some((u) => /reference_/.test(u)))
  await page.close()
}

// ---------- 7-约束 联系表单 ----------
console.log('9) 约拍/联系表单校验与成功态')
{
  const page = await newPage()
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' })
  const submit = page.getByRole('button', { name: '发送消息' })
  check('初始提交按钮禁用', await submit.isDisabled())

  await page.getByLabel('邮箱').fill('bad')
  await page.getByLabel('邮箱').blur()
  check('非法邮箱行内报错', await page.getByText('请输入有效的邮箱地址').isVisible())

  await page.getByLabel('姓名').fill('访客')
  await page.getByLabel('邮箱').fill('hello@example.com')
  await page.getByLabel('留言').fill('想了解一项完整的摄影合作计划，谢谢。')
  check('合法输入后按钮可点', await submit.isEnabled())

  // 留空也应在字段边提示：清空后直接触发表单兜底校验
  await page.getByLabel('姓名').fill('')
  await submit.click({ force: true })
  check('空姓名行内报错', await page.getByText('请输入姓名').isVisible())
  await page.getByLabel('姓名').fill('访客')
  await submit.click()
  await page.getByText('谢谢你的来信').waitFor()
  check('提交后出现感谢页', await page.getByText('谢谢你的来信').isVisible())
  check('感谢页区别于原表单', await page.locator('.contact-form').count() === 0)
  await page.close()
}

check('全程无 console error', errors.length === 0, errors.join(' | '))

await browser.close()
console.log(`\n结果：${pass} 通过，${fail} 失败`)
process.exit(fail ? 1 : 0)
