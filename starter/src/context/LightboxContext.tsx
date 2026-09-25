import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { Photo } from '../data/photos'
import Lightbox from '../components/Lightbox'

interface LightboxState {
  photos: Photo[]
  index: number
}

type OpenLightbox = (photos: Photo[], index: number) => void

const LightboxContext = createContext<OpenLightbox>(() => {})

export function useLightbox(): OpenLightbox {
  return useContext(LightboxContext)
}

// 全局唯一的灯箱实例：任何页面打开时都把自己"当前这一组"照片传进来，
// 灯箱的上一张/下一张只在这组照片里循环，不会串到别的分组。
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState | null>(null)
  const location = useLocation()

  useEffect(() => {
    setState(null)
  }, [location.pathname])

  const open = useCallback<OpenLightbox>((photos, index) => setState({ photos, index }), [])
  const close = useCallback(() => setState(null), [])
  const navigate = useCallback((next: number) => {
    setState(s => (s ? { ...s, index: next } : s))
  }, [])

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {state && (
        <Lightbox photos={state.photos} index={state.index} onClose={close} onNavigate={navigate} />
      )}
    </LightboxContext.Provider>
  )
}
