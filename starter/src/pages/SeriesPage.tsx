import { Link, useParams } from 'react-router-dom'
import {
  categoryLabel,
  getSeries,
  photosBySeries,
} from '../data/portfolio'
import { useLightbox } from '../context/LightboxContext'
import RatioImage from '../components/RatioImage'

export default function SeriesPage() {
  const { seriesId } = useParams<{ seriesId: string }>()
  const { open } = useLightbox()

  if (!seriesId) return <NotFound />
  let series
  try {
    series = getSeries(seriesId)
  } catch {
    return <NotFound />
  }

  // 页面全部内容均从 photos.json 按 seriesId 派生，顺序以 order 为准。
  const group = photosBySeries(series.id)
  const cover = group[0]

  return (
    <div className="series-page">
      <section className="series-hero" style={{ backgroundImage: `url(/${cover.file})` }}>
        <div className="hero-shade" />
        <div className="container hero-inner">
          <p className="eyebrow">
            {categoryLabel(series.category)} · {group.length} 幅
          </p>
          <h1>{series.title}</h1>
          <p className="hero-sub">{series.summary}</p>
        </div>
      </section>

      <div className="container story">
        <p className="pull-quote">{series.summary}</p>

        {group.map((photo, i) => (
          <div key={photo.id}>
            <article className={`story-block ${i % 2 === 1 ? 'reverse' : ''}`}>
              <button
                type="button"
                className="photo-button story-photo"
                aria-label={`查看照片：${photo.title}`}
                onClick={() => open(group, photo.id)}
              >
                <RatioImage photo={photo} />
                <span className="story-photo-meta">
                  <strong>{photo.title}</strong>
                  <span>{categoryLabel(photo.category)}</span>
                </span>
              </button>

              <div className="story-text">
                <p className="story-index">{String(photo.order).padStart(2, '0')}</p>
                <h2>{photo.title}</h2>
                <p>{photo.caption}</p>
              </div>
            </article>

            {/* 叙事节奏：第二段之后插入点题引言（同一份 summary，不新增业务文案）。 */}
            {i === 1 && (
              <blockquote className="pull-quote inline-quote">“{series.summary}”</blockquote>
            )}
          </div>
        ))}

        <p className="back-link">
          <Link to="/work" className="text-link">
            ← 返回作品集
          </Link>
        </p>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="container page-head">
      <h1>找不到这个系列</h1>
      <Link to="/work" className="text-link">
        ← 返回作品集
      </Link>
    </div>
  )
}
