import { photoSrc, photos } from '../data/photos'

const portrait = photos.find(p => p.id === 'portrait-01') ?? photos[0]

const TIMELINE = [
  { year: '2012', text: '开始自学摄影，最初拍摄城市街头与身边人。' },
  { year: '2015', text: '转为独立摄影师，开始黑白人像长期项目《凝视》。' },
  { year: '2018', text: '第一次深入高原无人区，开启风光系列《无人之境》。' },
  { year: '2021', text: '在高原牧场驻留数月，记录游牧日常，形成《高原牧歌》。' },
  { year: '2024', text: '三个系列持续更新中，接受人像与纪实类约拍。' },
]

export default function About() {
  return (
    <div className="container page">
      <div className="about-grid">
        <div className="about-photo">
          <span
            className="ratio-box"
            style={{ aspectRatio: `${portrait.width} / ${portrait.height}` }}
          >
            <img src={photoSrc(portrait)} alt={portrait.altText} loading="lazy" decoding="async" />
          </span>
          <p className="about-photo-note">《{portrait.title}》· 选自系列「凝视」</p>
        </div>

        <div>
          <p className="eyebrow">About</p>
          <h1 className="about-title">作者简介</h1>
          <div className="bio">
            <p>
              林默，独立摄影师，长期拍摄两类题材：黑白人像特写，以及高原地区的自然风光与牧场生活。
              她习惯用自然光工作，相信克制的画面比堆砌的奇观更接近真实。
            </p>
            <p>
              人像系列《凝视》聚焦镜头前的坦露与防备；风光系列《无人之境》记录高海拔无人区的山脊、
              草甸与雾气；牧场系列《高原牧歌》则来自与牧民同吃同住的数月驻留，关于人与牲畜、
              土地之间缓慢而坚韧的共生关系。
            </p>
            <p>
              现居成都，每年春夏两季在高原工作。拍摄之余也为杂志与品牌提供纪实影像，
              约拍与合作请通过「约拍」页面来信。
            </p>
          </div>

          <h2 className="timeline-title">经历</h2>
          <ul className="timeline">
            {TIMELINE.map(item => (
              <li key={item.year}>
                <span className="year">{item.year}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
