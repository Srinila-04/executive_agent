import { useEffect, useRef, useState } from 'react'
import { Menu, Search, Sun, Moon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const pageTitles = {
  '/': 'Overview',
  '/orders': 'Orders',
  '/assessments': 'Assessments · Agent 2',
  '/my-work': 'My Work Queue',
  '/monitoring': 'Monitoring · Agent 3',
  '/monitoring/orders': 'Monitoring · Monitored Orders',
  '/monitoring/outbox': 'Notification Outbox',
  '/architecture': 'System Architecture',
  '/framework': 'System Framework & Flow',
  '/architecture-diagram': 'System Architecture',
  '/assistant': 'AI Assistant · Agent 1',
  '/reports': 'Reports & Analytics',
  '/settings': 'Settings & Team',
  // Backward compatibility aliases
  '/alerts': 'Monitoring · Agent 3',
  '/outbox': 'Notification Outbox',
  '/allocation': 'Assessments · Agent 2',
  '/approvals': 'My Work Queue',
  '/kpis': 'Reports & Analytics',
}

export function Topbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const searchInput = useRef(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  const title = pathname.startsWith('/orders/')
    ? 'Order Details'
    : pageTitles[pathname] || 'Command Center'

  const userRole = user?.role ? user.role.toUpperCase() : 'OPERATOR'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const submitSearch = (event) => {
    event.preventDefault()
    if (search.trim()) {
      navigate(`/orders?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header
      className="topbar"
      style={{
        background: 'var(--dr-surface, var(--surface-hi))',
        borderBottom: '1px solid var(--dr-border, var(--line))',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 15,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          type="button"
          className="icon-button mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Manufacturing 360</span>
          <span style={{ color: 'var(--line)' }}>/</span>
          <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{title}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <form
          onSubmit={submitSearch}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search size={15} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
          <input
            ref={searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders, customers, or parts… (⌘K)"
            aria-label="Search orders"
            style={{
              background: 'var(--kg-bg-2, var(--page-bg))',
              border: '1px solid var(--line)',
              borderRadius: 8,
              padding: '6px 36px 6px 32px',
              fontSize: 12,
              color: 'var(--text-primary)',
              width: 260,
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--brand-purple)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--line)' }}
          />
          <kbd
            style={{
              position: 'absolute',
              right: 8,
              fontSize: 10,
              color: 'var(--text-muted)',
              background: 'var(--surface-hi)',
              border: '1px solid var(--line)',
              borderRadius: 4,
              padding: '2px 5px',
            }}
          >
            ⌘K
          </kbd>
        </form>

        {/* LIGHT / DARK THEME TOGGLE BUTTON */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          style={{
            background: 'var(--kg-bg-2, var(--surface-hi))',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            transition: 'all 0.15s ease',
          }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} style={{ color: 'var(--brand-orange)' }} />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={15} style={{ color: 'var(--brand-purple)' }} />
              <span>Dark</span>
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderLeft: '1px solid var(--line)', paddingLeft: 14 }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: 'var(--brand-purple-soft)',
              border: '1px solid rgba(111, 61, 186, 0.25)',
              color: 'var(--brand-purple)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {userRole}
          </div>
        </div>
      </div>
    </header>
  )
}
