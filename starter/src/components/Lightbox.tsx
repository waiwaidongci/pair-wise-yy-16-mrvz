import { useEffect } from 'react'
import { useLightbox } from '../context/LightboxContext'
import { categoryLabel } from '../data/portfolio'

/**
 * 全局共享灯箱：首页精选、片库网格、系列长页的片图都打开这一个组件。
 * 上一张/下一张只围绕传入的那一组循环；计数器显示组内第几张。
 * 窄屏下说明面板落在画面下方（见 styles.css 媒体查询）。
 */
export default function Lightbox() {
  const { state, close, next, prev } = useLightbox()

  useEffect(() => {
    if (!state) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [state, close, next, prev])

  if (!state) return null

  const { photos: group, index } = state
  const photo = group[index]
  const total = group.length

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`照片浏览：${photo.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <button type="button" className="lightbox-close" aria-label="关闭" onClick={close}>
        ✕
      </button>

      <button type="button" className="lightbox-nav lightbox-prev" aria-label="上一张" onClick={prev}>
        ‹
      </button>
      <button type="button" className="lightbox-nav lightbox-next" aria-label="下一张" onClick={next}>
        ›
      </button>

      <figure className="lightbox-frame">
        <div className="lightbox-stage">
          <img
            key={photo.id}
            className="lightbox-image"
            src={`/${photo.file}`}
            alt={photo.altText}
            width={photo.width}
            height={photo.height}
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          />
        </div>
        <figcaption className="lightbox-info">
          <p className="eyebrow">
            {categoryLabel(photo.category)} · {index + 1} / {total}
          </p>
          <h2>{photo.title}</h2>
          <p className="caption">{photo.caption}</p>
        </figcaption>
      </figure>
    </div>
  )
}
