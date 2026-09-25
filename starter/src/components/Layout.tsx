import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Lightbox from './Lightbox'

const NAV = [
  { to: '/', label: '首页', end: true },
  { to: '/work', label: '作品', end: false },
  { to: '/about', label: '关于', end: false },
  { to: '/contact', label: '联系', end: false },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // 路由切换后自动收起移动端菜单并回到页首。
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="site">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            光影志
          </Link>

          <button
            type="button"
            className="menu"
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="主导航">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <span className="logo">光影志</span>
          <p className="footer-line">凝视旷野，也凝视人。</p>
          <span className="footer-mark">独立摄影作品集</span>
        </div>
      </footer>

      <Lightbox />
    </div>
  )
}
