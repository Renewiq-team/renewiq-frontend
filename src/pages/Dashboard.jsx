import { useData } from '../context/DataContext'
import { formatCurrency, formatDate, daysUntil, avatarColor } from '../utils/helpers'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard({ onNavigate, onAddCustomer, onAddSubscription, onAddPlan }) {
  const { getCustomers, getSubscriptions, getInvoices, getPlan, getCustomer } = useData()

  const customers = getCustomers()
  const subs = getSubscriptions()
  const invoices = getInvoices()

  const activeSubs = subs.filter((s) => s.status === 'active')

  const mrr =
    activeSubs
      .filter((s) => getPlan(s.planId)?.interval === 'monthly')
      .reduce((sum, s) => sum + s.amount, 0) +
    activeSubs
      .filter((s) => getPlan(s.planId)?.interval === 'yearly')
      .reduce((sum, s) => sum + Math.round(s.amount / 12), 0) +
    activeSubs
      .filter((s) => getPlan(s.planId)?.interval === 'quarterly')
      .reduce((sum, s) => sum + Math.round(s.amount / 3), 0)

  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const churned = customers.filter((c) => c.status === 'churned' || c.status === 'inactive').length
  const churnRate = customers.length ? ((churned / customers.length) * 100).toFixed(1) : 0
  const pendingInvoices = invoices.filter((i) => i.status === 'pending' || i.status === 'overdue')

  const upcomingRenewals = activeSubs
    .filter((s) => s.nextRenewal)
    .map((s) => ({ ...s, days: daysUntil(s.nextRenewal) }))
    .filter((s) => s.days !== null && s.days <= 30)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5)

  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
  const revenues = [12500, 18200, 15800, 22100, 19500, totalRevenue > 0 ? Math.min(totalRevenue, 28000) : 24000]
  const maxRev = Math.max(...revenues)

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-label">Monthly Recurring Revenue</div>
          <div className="stat-value">{formatCurrency(mrr)}</div>
          <div className="stat-change up">↑ Active subscriptions</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Total Revenue (Paid)</div>
          <div className="stat-value">{formatCurrency(totalRevenue)}</div>
          <div className="stat-change up">
            {invoices.filter((i) => i.status === 'paid').length} invoices paid
          </div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Active Customers</div>
          <div className="stat-value">{customers.filter((c) => c.status === 'active').length}</div>
          <div className="stat-change">{customers.length} total customers</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Churn Rate</div>
          <div className="stat-value">{churnRate}%</div>
          <div className="stat-change down">{churned} churned / inactive</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Revenue Overview</span>
            <span className="badge badge-info">Last 6 months</span>
          </div>
          <div className="card-body">
            <div className="chart-bars">
              {months.map((m, i) => (
                <div className="chart-bar-wrap" key={m}>
                  <div
                    className="chart-bar"
                    style={{ height: Math.max(8, (revenues[i] / maxRev) * 140) + 'px' }}
                    title={formatCurrency(revenues[i])}
                  />
                  <div className="chart-bar-label">{m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Upcoming Renewals (30 days)</span>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('renewals')}>
              View all
            </button>
          </div>
          <div className="card-body no-pad">
            {upcomingRenewals.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="empty-icon">⏰</div>
                <h3>No renewals in next 30 days</h3>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Plan</th>
                      <th>Days Left</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingRenewals.map((s) => {
                      const c = getCustomer(s.customerId)
                      const p = getPlan(s.planId)
                      const dayClass =
                        s.days <= 7 ? 'badge-danger' : s.days <= 14 ? 'badge-warning' : 'badge-info'
                      return (
                        <tr key={s.id}>
                          <td>
                            <div className="customer-cell">
                              <div
                                className="avatar-sm"
                                style={{ background: avatarColor(c?.name) }}
                              >
                                {(c?.name || '?').charAt(0)}
                              </div>
                              <div className="info">
                                <div className="name">{c?.name || 'Unknown'}</div>
                              </div>
                            </div>
                          </td>
                          <td>{p?.name || '—'}</td>
                          <td>
                            <span className={`badge ${dayClass}`}>{s.days}d</span>
                          </td>
                          <td className="invoice-amount">{formatCurrency(s.amount)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pending & Overdue Invoices</span>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('invoices')}>
              View all
            </button>
          </div>
          <div className="card-body no-pad">
            {pendingInvoices.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="empty-icon">✓</div>
                <h3>All invoices settled</h3>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Customer</th>
                      <th>Due</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingInvoices.slice(0, 5).map((inv) => {
                      const c = getCustomer(inv.customerId)
                      return (
                        <tr key={inv.id}>
                          <td>
                            <strong>{inv.invoiceNumber}</strong>
                          </td>
                          <td>{c?.name || '—'}</td>
                          <td>{formatDate(inv.dueDate)}</td>
                          <td className="invoice-amount">{formatCurrency(inv.amount)}</td>
                          <td>
                            <StatusBadge status={inv.status} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Quick Actions</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" onClick={onAddCustomer}>
                + Add Customer
              </button>
              <button className="btn btn-secondary" onClick={onAddSubscription}>
                + Create Subscription
              </button>
              <button className="btn btn-secondary" onClick={onAddPlan}>
                + Create Plan
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('ai')}>
                🤖 View AI Insights
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}