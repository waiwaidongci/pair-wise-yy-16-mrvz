import { getPhoto } from '../data/portfolio'

interface TimelineItem {
  year: string
  text: string
}

// 关于页只有摄影师自述与经历，是页面固有的编辑文案，不涉及片库业务数据。
const BIO_PARAGRAPHS = [
  '我是一名独立摄影师，常年往返于城市影棚与西部高原。镜头前，我拍摄黑白人像的特写，试图在皮肤纹理与眼神的停顿里，留下坦露与防备交错的一瞬。',
  '镜头之外，我一次次回到无人的山脊、起雾的山谷和高原牧场。那里的时间走得很慢，光线却从不重复。我相信好的照片不是被"拍"出来的，而是在长久的等待里，自己走到取景器中间的。',
]

const TIMELINE: TimelineItem[] = [
  { year: '2014', text: '开始黑白人像特写系列《凝视》的长期拍摄' },
  { year: '2017', text: '首次深入高海拔无人区，开启《无人之境》' },
  { year: '2019', text: '作品入选高原纪实摄影展，开始牧场题材记录' },
  { year: '2020', text: '完成游牧生活系列《高原牧歌》，成为独立摄影师' },
]

export default function AboutPage() {
  const portrait = getPhoto('portrait-02')

  return (
    <div className="container about-page">
      <div className="about-portrait">
        <img
          src={`/${portrait.file}`}
          alt={portrait.altText}
          width={portrait.width}
          height={portrait.height}
          style={{ aspectRatio: `${portrait.width} / ${portrait.height}` }}
        />
      </div>

      <div className="about-content">
        <p className="eyebrow">关于</p>
        <h1>关于摄影师</h1>

        {BIO_PARAGRAPHS.map((p, i) => (
          <p key={i} className="about-bio">
            {p}
          </p>
        ))}

        <ol className="timeline">
          {TIMELINE.map((item) => (
            <li key={item.year}>
              <span className="timeline-year">{item.year}</span>
              <span className="timeline-text">{item.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
