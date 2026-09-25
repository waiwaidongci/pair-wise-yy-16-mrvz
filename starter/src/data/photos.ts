import data from '../photos.json'

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

// 唯一数据源：mock-data/photos.json 的拷贝（src/photos.json），全站共享这一份。
export const categories = data.categories as Category[]
export const seriesList = data.series as Series[]
export const photos = data.photos as Photo[]

export const ALL = 'all'

export function photosForCategory(category: string): Photo[] {
  return category === ALL ? photos : photos.filter(p => p.category === category)
}

export function photosForSeries(seriesId: string): Photo[] {
  return photos.filter(p => p.seriesId === seriesId).sort((a, b) => a.order - b.order)
}

export function seriesById(id: string | undefined): Series | undefined {
  return seriesList.find(s => s.id === id)
}

export function categoryLabel(id: string): string {
  return categories.find(c => c.id === id)?.label ?? id
}

export function photoSrc(photo: Photo): string {
  return `/${photo.file}`
}
