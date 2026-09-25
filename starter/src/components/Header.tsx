import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { seriesList } from '../data/photos'

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav-link active' : 'nav-link')

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          林默<span>摄影</span>
        </Link>
        <button
          type="button"
          className="menu"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={open ? 'site-nav open' : 'site-nav'} aria-label="主导航">
          <NavLink to="/" end className={navClass}>
            封面
          </NavLink>
          <NavLink to="/work" className={navClass}>
            片库
          </NavLink>
          <div className="nav-dropdown">
            <span className="nav-link nav-dropdown-label">主题长页</span>
            <div className="dropdown-menu">
              {seriesList.map(s => (
                <NavLink key={s.id} to={`/work/${s.id}`} className={navClass}>
                  {s.title}
                </NavLink>
              ))}
            </div>
          </div>
          <NavLink to="/about" className={navClass}>
            作者简介
          </NavLink>
          <NavLink to="/contact" className="nav-link nav-cta">
            约拍
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
