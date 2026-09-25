import type { Photo } from '../data/portfolio'
import { categoryLabel } from '../data/portfolio'
import { useLightbox } from '../context/LightboxContext'
import RatioImage from './RatioImage'

interface PhotoCardProps {
  /** 点击这张图时，灯箱左右切换所围绕的那一组。 */
  group: Photo[]
  photo: Photo
}

/** 网格中的一张片图：整卡是按钮，打开同一个全局灯箱。 */
export default function PhotoCard({ group, photo }: PhotoCardProps) {
  const { open } = useLightbox()
  return (
    <figure className="photo-card">
      <button
        type="button"
        className="photo-button"
        aria-label={`查看照片：${photo.title}`}
        onClick={() => open(group, photo.id)}
      >
        <RatioImage photo={photo} />
        <span className="photo-meta">
          <strong>{photo.title}</strong>
          <span className="photo-category">{categoryLabel(photo.category)}</span>
        </span>
      </button>
    </figure>
  )
}
