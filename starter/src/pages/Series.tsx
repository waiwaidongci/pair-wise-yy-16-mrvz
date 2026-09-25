import { Link, Navigate, useParams } from 'react-router-dom'
import PhotoButton from '../components/PhotoButton'
import { categoryLabel, photoSrc, photosForSeries, seriesById } from '../data/photos'

export default function Series() {
  const { seriesId } = useParams()
  const series = seriesById(seriesId)

  if (!series) {
    return <Navigate to="/work" replace />
  }

  // 与片库共用同一份数据模型：照片、标题、说明全部来自 photos.json
  const seriesPhotos = photosForSeries(series.id)
  const cover = seriesPhotos[0]

  return (
    <div className="series-page">
      <section className="series-hero">
        <img className="series-hero-img" src={photoSrc(cover)} alt={cover.altText} />
        <div className="series-hero-overlay" />
        <div className="container series-hero-content">
          <p className="eyebrow">
            {categoryLabel(series.category)} 系列 · 共 {seriesPhotos.length} 张
          </p>
          <h1>《{series.title}》</h1>
        </div>
      </section>

      <div className="container">
        <blockquote className="series-quote">{series.summary}</blockquote>

        <div className="story">
          {seriesPhotos.map((photo, i) => (
            <article key={photo.id}>
              <PhotoButton photo={photo} group={seriesPhotos} index={i} withMeta={false} />
              <div className="story-text">
                <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
                <h2>{photo.title}</h2>
                <p className="story-caption">{photo.caption}</p>
                <p className="story-alt">{photo.altText}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="back-row">
          <Link to="/work" className="text-link">
            ← 返回片库
          </Link>
        </p>
      </div>
    </div>
  )
}
