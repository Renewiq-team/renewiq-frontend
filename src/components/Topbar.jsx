import { useTheme } from '../context/ThemeContext'

const TITLES = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  subscriptions: 'Subscriptions',
  plans: 'Plans',
  invoices: 'Invoices',
  renewals: 'Upcoming Renewals',
  analytics: 'Analytics',
  ai: 'AI Insights',
}

export default function Topbar({ page, onMenuClick, onSearch }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <h1 className="page-title">{TITLES[page] || page}</h1>
      </div>
      <div className="topbar-right">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search customers..."
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}