import { useState, type ChangeEvent, type FocusEvent } from 'react'
import { Link } from 'react-router-dom'

interface FormValues {
  name: string
  email: string
  message: string
}

type Errors = Partial<Record<keyof FormValues, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: FormValues): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = '请输入姓名'
  if (!values.email.trim()) {
    errors.email = '请输入邮箱'
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = '请输入有效的邮箱地址'
  }
  if (values.message.trim().length < 10) {
    errors.message = values.message.trim() ? '留言至少需要 10 个字符' : '请输入留言'
  }
  return errors
}

export default function ContactPage() {
  const [values, setValues] = useState<FormValues>({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0

  const update = (field: keyof FormValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
  }

  const blur = (field: keyof FormValues) => (_e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  // 留空提交也要在字段边给出提示（此时按钮虽禁用，仍兜底校验一次）。
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (!isValid || sending) return
    setSending(true)
    // 无后端：仅前端模拟发送状态。
    window.setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 900)
  }

  if (sent) {
    return (
      <div className="container contact-success" role="status">
        <span className="success-check" aria-hidden="true">
          ✓
        </span>
        <p className="eyebrow">发送成功</p>
        <h1>谢谢你的来信</h1>
        <p className="page-sub">消息已妥善收到，我们会尽快与你联系。</p>
        <Link to="/" className="text-link">
          返回首页 →
        </Link>
      </div>
    )
  }

  return (
    <div className="container contact-page">
      <header className="page-head contact-head">
        <p className="eyebrow">联系</p>
        <h1>让我们聊聊你的计划</h1>
        <p className="page-sub">无论是肖像拍摄、纪录项目或作品合作，都欢迎留下信息。</p>
      </header>

      <form className="contact-form" noValidate onSubmit={handleSubmit}>
        <Field
          id="name"
          label="姓名"
          error={touched.name ? errors.name : undefined}
        >
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            autoComplete="name"
            aria-invalid={Boolean(touched.name && errors.name)}
            onChange={update('name')}
            onBlur={blur('name')}
          />
        </Field>

        <Field
          id="email"
          label="邮箱"
          error={touched.email ? errors.email : undefined}
        >
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            autoComplete="email"
            aria-invalid={Boolean(touched.email && errors.email)}
            onChange={update('email')}
            onBlur={blur('email')}
          />
        </Field>

        <Field
          id="message"
          label="留言"
          error={touched.message ? errors.message : undefined}
        >
          <textarea
            id="message"
            name="message"
            rows={6}
            value={values.message}
            aria-invalid={Boolean(touched.message && errors.message)}
            onChange={update('message')}
            onBlur={blur('message')}
          />
        </Field>

        <button type="submit" className="submit-btn" disabled={!isValid || sending}>
          {sending ? '发送中…' : '发送消息'}
        </button>
      </form>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
