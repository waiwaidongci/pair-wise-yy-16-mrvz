import type { CSSProperties } from 'react'
import type { Photo } from '../data/portfolio'

interface RatioImageProps {
  photo: Photo
  className?: string
  eager?: boolean
}

/**
 * 按 photos.json 里记录的真实宽高，在图片解码之前就撑开正确比例的容器，
 * 避免图片加载完成后布局跳动（CLS）。
 */
export default function RatioImage({ photo, className, eager }: RatioImageProps) {
  const style = {
    aspectRatio: `${photo.width} / ${photo.height}`,
  } as CSSProperties
  return (
    <div className={`ratio-box ${className ?? ''}`} style={style}>
      <img
        src={`/${photo.file}`}
        alt={photo.altText}
        width={photo.width}
        height={photo.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}
