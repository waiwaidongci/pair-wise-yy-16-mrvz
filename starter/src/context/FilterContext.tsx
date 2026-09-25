import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { ALL } from '../data/photos'

interface FilterValue {
  filter: string
  setFilter: (next: string) => void
}

const FilterContext = createContext<FilterValue>({ filter: ALL, setFilter: () => {} })

// 筛选状态放在路由之外的 Provider 里：/work → /work/:seriesId → 返回
// 整个过程中组件树不卸载，筛选条件自然保留（不写入 URL，返回时地址仍是 /work）。
export function FilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState(ALL)
  const value = useMemo(() => ({ filter, setFilter }), [filter])
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilter(): FilterValue {
  return useContext(FilterContext)
}
