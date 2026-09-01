import { useData } from '../context/DataContext'
import { formatCurrency } from '../utils/helpers'

export default function Analytics() {
  const { getCustomers, getSubscriptions, getInvoices, getPlans, getPlan } = useData()

  const customers = getCustomers()
  const subs = getSubscriptions()
  const invoices = getInvoices()
  const plans = getPlans()

  const activeSubs = subs.filter((s) => s.status === 'active')
  const paidInvoices = invoices.filter((i) => i.status === 'paid')
  const totalRevenue = paidInvoices.reduce((s, i) => s + i.amount, 0)

  const planDist = {}
  activeSubs.forEach((s) => {
    const name = getPlan(s.planId)?.name || 'Unknown'
    planDist[name] = (planDist[name] || 0) + 1
  })

  const statusDist = {}
  customers.forEach((c) => {
    statusDist[c.status] = (statusDist[c.status] || 0) + 1
  })

  return (
    <>
      <div className="page-header">
        <h2>Analytics</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">{formatCurrency(totalRevenue)}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Active Subscriptions</div>
          <div className="stat-value">{activeSubs.length}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Avg. Revenue / Sub</div>
          <div className="stat-value">
            {formatCurrency(activeSubs.length ? Math.round(totalRevenue / activeSubs.length) : 0)}
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Pending Collection</div>
          <div className="stat-value">
            {formatCurrency(
              invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount, 0)
            )}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Plan Distribution (Active)</span>
          </div>
          <div className="card-body">
            {Object.keys(planDist).length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No active subscriptions</p>
            ) : (
              Object.entries(planDist).map(([name, count]) => {
                const pct = Math.round((count / activeSubs.length) * 100)
                return (
                  <div key={name} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        marginBottom: 4,
                      }}
                    >
                      <span>{name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: pct + '%' }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Customer Status Breakdown</span>
          </div>
          <div className="card-body">
            {Object.entries(statusDist).map(([status, count]) => {
              const pct = Math.round((count / customers.length) * 100) || 0
              return (
                <div key={status} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{status}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: pct + '%' }} />
                  </div>
                </div>
              )
            })}
            {Object.keys(statusDist).length === 0 && (
              <p style={{ color: 'var(--text-muted)' }}>No customers</p>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">Revenue by Plan (Paid Invoices)</span>
        </div>
        <div className="card-body no-pad">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Subscriptions</th>
                  <th>Total Billed</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => {
                  const planSubs = subs.filter((s) => s.planId === p.id)
                  const planRev = invoices
                    .filter((i) => {
                      const sub = subs.find((s) => s.id === i.subscriptionId)
                      return sub && sub.planId === p.id && i.status === 'paid'
                    })
                    .reduce((s, i) => s + i.amount, 0)
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{planSubs.length}</td>
                      <td className="invoice-amount">{formatCurrency(planRev)}</td>
                    </tr>
                  )
                })}
                {plans.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}