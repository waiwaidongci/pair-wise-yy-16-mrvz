// 唯一权威内容数据源：src/data/photos.json（由 mock-data/photos.json 原样拷贝）。
// 所有页面的照片、标题、说明都从这里派生，禁止在组件中另写一份。
import raw from './photos.json'

export interface Photo {
  id: string
  category: string
  seriesId: string
  file: string
  title: string
  altText: string
  caption: string
  width: number
  height: number
  order: number
}

export interface Series {
  id: string
  title: string
  category: string
  summary: string
  photoIds: string[]
}

export interface Category {
  id: string
  label: string
}

export const categories = raw.categories as Category[]
export const seriesList = raw.series as Series[]
export const photos = raw.photos as Photo[]

const byId = new Map(photos.map((p) => [p.id, p]))
const seriesMap = new Map(seriesList.map((s) => [s.id, s]))
const categoryMap = new Map(categories.map((c) => [c.id, c]))

export function getPhoto(id: string): Photo {
  const p = byId.get(id)
  if (!p) throw new Error(`未知照片 id：${id}`)
  return p
}

export function getSeries(id: string): Series {
  const s = seriesMap.get(id)
  if (!s) throw new Error(`未知系列 id：${id}`)
  return s
}

export function categoryLabel(id: string): string {
  return categoryMap.get(id)?.label ?? id
}

/** 某分类下的全部照片（/work 网格与灯箱共用此派生结果）。 */
export function photosByCategory(categoryId: string): Photo[] {
  return categoryId === 'all' ? [...photos] : photos.filter((p) => p.category === categoryId)
}

/** 某系列的照片，严格按 order 排序（系列长页与首页精选共用）。 */
export function photosBySeries(seriesId: string): Photo[] {
  return photos
    .filter((p) => p.seriesId === seriesId)
    .sort((a, b) => a.order - b.order)
}
