import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { categories, photosByCategory, seriesList } from '../data/portfolio'
import { useFilter } from '../context/FilterContext'
import PhotoCard from '../components/PhotoCard'

export default function WorkPage() {
  const { category, setCategory } = useFilter()

  // 筛选结果同时是网格数据源与灯箱导航范围。
  const group = useMemo(() => photosByCategory(category), [category])

  // 某个具体分类激活时，该分类恰好对应一个系列，给出长页入口。
  const activeSeries =
    category === 'all' ? undefined : seriesList.find((s) => s.category === category)

  return (
    <div className="container work-page">
      <header className="page-head">
        <p className="eyebrow">作品集</p>
        <h1>所有作品</h1>
        <p className="page-sub">从贴近面孔的凝视，到远离人群的高原。</p>
      </header>

      <div className="filters" role="group" aria-label="按题材筛选">
        <FilterButton
          active={category === 'all'}
          label="全部"
          onClick={() => setCategory('all')}
        />
        {categories.map((c) => (
          <FilterButton
            key={c.id}
            active={category === c.id}
            label={c.label}
            onClick={() => setCategory(c.id)}
          />
        ))}
      </div>

      <p className="result-count">{group.length} 张照片</p>

      {activeSeries && (
        <p className="series-entry">
          <Link to={`/work/${activeSeries.id}`} className="text-link">
            进入《{activeSeries.title}》系列 →
          </Link>
        </p>
      )}

      {/*
       * 桌面多列 masonry（CSS 多列 + break-inside），
       * 窄屏（<720px）在 styles.css 中切为单列。
       */}
      <div className="masonry">
        {group.map((photo) => (
          <PhotoCard key={photo.id} group={group} photo={photo} />
        ))}
      </div>
    </div>
  )
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button type="button" className="filter-btn" aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  )
}
