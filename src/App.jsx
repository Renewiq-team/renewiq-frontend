import { useState } from 'react'
import { useData } from './context/DataContext'
import Toast from './components/Toast'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Subscriptions from './pages/Subscriptions'
import Plans from './pages/Plans'
import Invoices from './pages/Invoices'
import Renewals from './pages/Renewals'
import Analytics from './pages/Analytics'
import AIInsights from './pages/AIInsights'

export default function App() {
  const { isLoggedIn } = useData()
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [modals, setModals] = useState({
    customer: false,
    subscription: false,
    plan: false,
  })

  const navigate = (p) => {
    setPage(p)
    setSidebarOpen(false)
    if (p !== 'customers') setSearchQuery('')
  }

  const handleSearch = (q) => {
    setSearchQuery(q)
    if (q.trim().length >= 2) {
      setPage('customers')
    }
  }

  if (!isLoggedIn) {
    return (
      <>
        <Login />
        <Toast />
      </>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar
        page={page}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main">
        <Topbar
          page={page}
          onMenuClick={() => setSidebarOpen(true)}
          onSearch={handleSearch}
        />

        <div className="content">
          {page === 'dashboard' && (
            <Dashboard
              onNavigate={navigate}
              onAddCustomer={() => setModals({ ...modals, customer: true })}
              onAddSubscription={() => {
                setPage('subscriptions')
                setModals({ ...modals, subscription: true })
              }}
              onAddPlan={() => {
                setPage('plans')
                setModals({ ...modals, plan: true })
              }}
            />
          )}
          {page === 'customers' && (
            <Customers
              searchQuery={searchQuery}
              openForm={modals.customer}
              onCloseForm={() => setModals({ ...modals, customer: false })}
            />
          )}
          {page === 'subscriptions' && (
            <Subscriptions
              openForm={modals.subscription}
              onCloseForm={(open) =>
                setModals({ ...modals, subscription: open === true })
              }
            />
          )}
          {page === 'plans' && (
            <Plans
              openForm={modals.plan}
              onCloseForm={() => setModals({ ...modals, plan: false })}
            />
          )}
          {page === 'invoices' && <Invoices />}
          {page === 'renewals' && <Renewals />}
          {page === 'analytics' && <Analytics />}
          {page === 'ai' && <AIInsights />}
        </div>
      </div>

      <Toast />
    </div>
  )
}

