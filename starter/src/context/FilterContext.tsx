import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

// 筛选状态提升到路由层之上：/work 卸载（进入系列长页）再返回时，
// 访客手上仍是刚选的那一组。
interface FilterContextValue {
  category: string
  setCategory: (id: string) => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<string>('all')
  const handleSet = useCallback((id: string) => setCategory(id), [])
  const value = useMemo(() => ({ category, setCategory: handleSet }), [category, handleSet])
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilter(): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilter 必须在 FilterProvider 内使用')
  return ctx
}
