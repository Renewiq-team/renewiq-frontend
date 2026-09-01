import { useData } from '../context/DataContext'

const NAV = [
  {
    section: 'Main',
    items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'customers', icon: '👥', label: 'Customers' },
      { id: 'subscriptions', icon: '🔄', label: 'Subscriptions' },
      { id: 'plans', icon: '📦', label: 'Plans' },
    ],
  },
  {
    section: 'Billing',
    items: [
      { id: 'invoices', icon: '🧾', label: 'Invoices' },
      { id: 'renewals', icon: '⏰', label: 'Renewals' },
    ],
  },
  {
    section: 'Insights',
    items: [
      { id: 'analytics', icon: '📈', label: 'Analytics' },
      { id: 'ai', icon: '🤖', label: 'AI Insights' },
    ],
  },
]

export default function Sidebar({ page, onNavigate, open, onClose }) {
  const { currentBiz, logout } = useData()

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">R</div>
            <span>RenewIQ</span>
          </div>
          <div className="business-badge">
            <div className="biz-name">{currentBiz?.name || 'Business'}</div>
            <div className="biz-plan">Business Plan · Multi-tenant</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((sec) => (
            <div className="nav-section" key={sec.section}>
              <div className="nav-section-title">{sec.section}</div>
              {sec.items.map((item) => (
                <button
                  key={item.id}
                  className={`nav-item ${page === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {(currentBiz?.ownerName || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="name">{currentBiz?.ownerName}</div>
              <div className="email">{currentBiz?.email}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm btn-full" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}