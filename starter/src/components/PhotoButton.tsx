import { categoryLabel, photoSrc, type Photo } from '../data/photos'
import { useLightbox } from '../context/LightboxContext'

interface PhotoButtonProps {
  photo: Photo
  /** 当前这组照片（灯箱左右切换的范围） */
  group: Photo[]
  index: number
  withMeta?: boolean
}

export default function PhotoButton({ photo, group, index, withMeta = true }: PhotoButtonProps) {
  const openLightbox = useLightbox()
  return (
    <button
      type="button"
      className="photo-button"
      aria-label={photo.title}
      onClick={() => openLightbox(group, index)}
    >
      {/* 解码前先用数据里的真实宽高比撑住版面，避免加载完成后布局跳动 */}
      <span className="ratio-box" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        <img src={photoSrc(photo)} alt={photo.altText} loading="lazy" decoding="async" />
      </span>
      {withMeta && (
        <span className="photo-meta">
          <strong>{photo.title}</strong>
          <span className="photo-cat">{categoryLabel(photo.category)}</span>
        </span>
      )}
    </button>
  )
}
