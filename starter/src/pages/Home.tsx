import { Link } from 'react-router-dom'
import { categoryLabel, photoSrc, photos, photosForSeries, seriesList } from '../data/photos'
import { useLightbox } from '../context/LightboxContext'

const heroPhoto = photos.find(p => p.id === 'landscape-01') ?? photos[0]

export default function Home() {
  const openLightbox = useLightbox()

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <img src={photoSrc(heroPhoto)} alt={heroPhoto.altText} />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow">独立摄影师 · 高原与肖像</p>
          <h1>林默</h1>
          <p className="hero-sub">
            以黑白人像凝视人心，以高原旷野安放目光。
            <br />
            三个长期系列：《凝视》《无人之境》《高原牧歌》。
          </p>
          <div className="hero-actions">
            <Link to="/work" className="btn btn-gold">
              进入片库
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              预约拍摄
            </Link>
          </div>
        </div>
      </section>

      <section className="container home-series">
        <div className="section-head">
          <h2>主题长页</h2>
          <span className="gold-line" aria-hidden="true" />
        </div>
        <div className="series-cards">
          {seriesList.map(series => {
            const seriesPhotos = photosForSeries(series.id)
            const cover = seriesPhotos[0]
            return (
              <article
                key={series.id}
                className="series-card"
                role="button"
                tabIndex={0}
                aria-label={`打开《${series.title}》系列浏览`}
                onClick={() => openLightbox(seriesPhotos, 0)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openLightbox(seriesPhotos, 0)
                  }
                }}
              >
                <span className="ratio-box" style={{ aspectRatio: `${cover.width} / ${cover.height}` }}>
                  <img src={photoSrc(cover)} alt={cover.altText} loading="lazy" decoding="async" />
                </span>
                <div className="series-card-body">
                  <p className="eyebrow">
                    {categoryLabel(series.category)} · {seriesPhotos.length} 张
                  </p>
                  <h3>《{series.title}》</h3>
                  <p className="series-summary">{series.summary}</p>
                  <Link to={`/work/${series.id}`} className="text-link" onClick={e => e.stopPropagation()}>
                    进入主题长页 →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
