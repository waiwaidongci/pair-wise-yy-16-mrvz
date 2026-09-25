import { Link } from 'react-router-dom'
import {
  photosBySeries,
  seriesList,
  getPhoto,
  categoryLabel,
  type Series,
} from '../data/portfolio'
import { useLightbox } from '../context/LightboxContext'
import RatioImage from '../components/RatioImage'

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="featured-section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">精选作品</p>
            <h2>三个系列</h2>
          </div>
          <div className="series-grid">
            {seriesList.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Hero() {
  // Hero 背景为真实片库照片（《独牛与木屋》），不加臆造素材。
  const hero = getPhoto('pastoral-01')
  return (
    <section className="hero" style={{ backgroundImage: `url(/${hero.file})` }}>
      <div className="hero-shade" />
      <div className="container hero-inner">
        <p className="eyebrow">独立摄影师 · 高原与面孔</p>
        <h1>在凝视与旷野之间</h1>
        <p className="hero-sub">
          记录黑白人像的细微情绪，以及高原地区自然与牧场生活的辽阔节奏。
        </p>
        <Link to="/work" className="text-link">
          浏览全部作品 →
        </Link>
      </div>
    </section>
  )
}

function SeriesCard({ series }: { series: Series }) {
  const { open } = useLightbox()
  const group = photosBySeries(series.id)
  const cover = group[0]

  return (
    <article className="series-card-wrap">
      {/* 点击卡片任意片图区域即打开共享灯箱，浏览范围限定为该系列。 */}
      <button
        type="button"
        className="series-card"
        onClick={() => open(group, cover.id)}
        aria-label={`预览《${series.title}》系列照片：${cover.title}`}
      >
        <RatioImage photo={cover} eager />
        <span className="series-card-overlay">
          <span className="series-card-title">{cover.title}</span>
          <span className="series-card-category">{categoryLabel(series.category)}</span>
        </span>
      </button>
      <div className="series-card-meta">
        <h3>{series.title}</h3>
        <p>{series.summary}</p>
        <Link to={`/work/${series.id}`} className="text-link">
          进入《{series.title}》系列 →
        </Link>
      </div>
    </article>
  )
}
