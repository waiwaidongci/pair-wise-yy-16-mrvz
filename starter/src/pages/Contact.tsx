import { useState, type ChangeEvent, type FormEvent } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Field = 'name' | 'email' | 'message'
type Values = Record<Field, string>
type Status = 'idle' | 'sending' | 'success'

const EMPTY: Values = { name: '', email: '', message: '' }

export default function Contact() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Record<Field, boolean>>({ name: false, email: false, message: false })
  const [status, setStatus] = useState<Status>('idle')

  const errors: Record<Field, string> = {
    name: values.name.trim() ? '' : '请填写姓名',
    email: !values.email.trim()
      ? '请填写邮箱'
      : EMAIL_RE.test(values.email.trim())
        ? ''
        : '请输入有效的邮箱地址',
    message: values.message.trim() ? '' : '请填写留言',
  }
  const isValid = !errors.name && !errors.email && !errors.message

  const handleChange = (field: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues(v => ({ ...v, [field]: e.target.value }))
  }
  const handleBlur = (field: Field) => () => {
    setTouched(t => ({ ...t, [field]: true }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (!isValid || status === 'sending') return
    setStatus('sending')
    // 离线演示：前端模拟发送，无真实后端
    window.setTimeout(() => setStatus('success'), 900)
  }

  const reset = () => {
    setValues(EMPTY)
    setTouched({ name: false, email: false, message: false })
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <div className="container page">
        <div className="form-success" role="status">
          <p className="success-mark" aria-hidden="true">
            ✓
          </p>
          <h1>谢谢你的来信</h1>
          <p>
            已收到 {values.name} 的约拍留言，我会在 1–2 个工作日内通过 {values.email} 回复你。
          </p>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            再写一封
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <div className="contact-grid">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="contact-title">约拍</h1>
          <div className="contact-intro">
            <p>接受人像写真、高原风光委托与牧场 / 纪实类跟拍。</p>
            <p>流程：来信说明需求 → 沟通细节与档期 → 确认报价后开始拍摄。</p>
            <p>一般 1–2 个工作日内回复；每年 5–9 月在高原驻留，档期请以回复为准。</p>
          </div>
        </div>

        <form className="contact-form" noValidate onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="contact-name">姓名</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              aria-invalid={Boolean(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
            />
            {touched.name && errors.name && (
              <p className="field-error" id="contact-name-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="contact-email">邮箱</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? 'contact-email-error' : undefined}
            />
            {touched.email && errors.email && (
              <p className="field-error" id="contact-email-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="contact-message">留言</label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={handleChange('message')}
              onBlur={handleBlur('message')}
              aria-invalid={Boolean(touched.message && errors.message)}
              aria-describedby={touched.message && errors.message ? 'contact-message-error' : undefined}
            />
            {touched.message && errors.message && (
              <p className="field-error" id="contact-message-error" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-gold submit-btn" disabled={!isValid || status === 'sending'}>
            {status === 'sending' ? '发送中…' : '发送消息'}
          </button>
        </form>
      </div>
    </div>
  )
}
