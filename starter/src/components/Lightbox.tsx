import { useCallback, useEffect, useRef } from 'react'
import { categoryLabel, photoSrc, type Photo } from '../data/photos'

interface LightboxProps {
  photos: Photo[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = photos[index]
  const total = photos.length
  const closeRef = useRef<HTMLButtonElement>(null)

  // 组内循环：到最后一张再往后会回到第一张，不会越出当前这组。
  const showPrev = useCallback(() => onNavigate((index - 1 + total) % total), [index, total, onNavigate])
  const showNext = useCallback(() => onNavigate((index + 1) % total), [index, total, onNavigate])

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') showPrev()
      else if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, showPrev, showNext])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title}，第 ${index + 1} 张，共 ${total} 张`}
    >
      <div className="lightbox-backdrop" onClick={onClose} />
      <button type="button" className="lightbox-close" aria-label="关闭" ref={closeRef} onClick={onClose}>
        ×
      </button>
      <button type="button" className="lightbox-arrow lightbox-prev" aria-label="上一张" onClick={showPrev}>
        ‹
      </button>
      <button type="button" className="lightbox-arrow lightbox-next" aria-label="下一张" onClick={showNext}>
        ›
      </button>
      <figure className="lightbox-stage">
        <img
          key={photo.id}
          className="lightbox-image"
          src={photoSrc(photo)}
          alt={photo.altText}
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        />
        <figcaption className="lightbox-info">
          <p className="eyebrow">
            {categoryLabel(photo.category)} · {index + 1} / {total}
          </p>
          <h2>{photo.title}</h2>
          <p className="lightbox-caption">{photo.caption}</p>
        </figcaption>
      </figure>
    </div>
  )
}
