import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PhotoButton from '../components/PhotoButton'
import { useFilter } from '../context/FilterContext'
import { ALL, categories, photos, photosForCategory, seriesList } from '../data/photos'

export default function Work() {
  const { filter, setFilter } = useFilter()
  // 灯箱的数据源就是这份筛选结果，保证左右切换只在当前这组里循环
  const visible = useMemo(() => photosForCategory(filter), [filter])

  return (
    <div className="container page">
      <header className="page-head">
        <p className="eyebrow">Works</p>
        <h1>片库</h1>
        <p className="page-sub">全部 {photos.length} 张作品，可按题材收窄；点击任意照片进入浏览浮层。</p>
      </header>

      <div className="filters" role="group" aria-label="按题材筛选">
        <button type="button" aria-pressed={filter === ALL} onClick={() => setFilter(ALL)}>
          全部
        </button>
        {categories.map(c => (
          <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <p className="series-entry">
        按系列阅读长页：
        {seriesList.map(s => (
          <Link key={s.id} to={`/work/${s.id}`}>
            {s.title}
          </Link>
        ))}
      </p>

      <div className="grid">
        {visible.map((photo, i) => (
          <PhotoButton key={photo.id} photo={photo} group={visible} index={i} />
        ))}
      </div>
    </div>
  )
}
