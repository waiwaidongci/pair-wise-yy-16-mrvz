import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Photo } from '../data/portfolio'

interface LightboxState {
  /** 当前灯箱内允许循环的照片集合（筛选结果 / 系列全集 / 单个系列）。 */
  photos: Photo[]
  index: number
}

interface LightboxContextValue {
  state: LightboxState | null
  /** 在给定的一组照片上下文中打开灯箱；startId 为被点击的那张。 */
  open: (photos: Photo[], startId: string) => void
  close: () => void
  next: () => void
  prev: () => void
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState | null>(null)

  const open = useCallback((group: Photo[], startId: string) => {
    const index = Math.max(0, group.findIndex((p) => p.id === startId))
    setState({ photos: group, index })
  }, [])

  const close = useCallback(() => setState(null), [])

  const step = useCallback((delta: number) => {
    setState((cur) => {
      if (!cur || cur.photos.length === 0) return cur
      const len = cur.photos.length
      return { ...cur, index: (cur.index + delta + len) % len }
    })
  }, [])

  const next = useCallback(() => step(1), [step])
  const prev = useCallback(() => step(-1), [step])

  const value = useMemo(
    () => ({ state, open, close, next, prev }),
    [state, open, close, next, prev],
  )

  return <LightboxContext.Provider value={value}>{children}</LightboxContext.Provider>
}

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox 必须在 LightboxProvider 内使用')
  return ctx
}
