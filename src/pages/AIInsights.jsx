import { useData } from '../context/DataContext'
import { formatCurrency, daysUntil } from '../utils/helpers'

export default function AIInsights() {
  const { getCustomers, getSubscriptions, getInvoices, getCustomer, getPlan } = useData()

  const customers = getCustomers()
  const subs = getSubscriptions()
  const invoices = getInvoices()

  const insights = []

  const overdueCustIds = new Set(
    invoices.filter((i) => i.status === 'overdue').map((i) => i.customerId)
  )
  const expiringNoRenew = subs.filter((s) => {
    if (s.status !== 'active' || s.autoRenew) return false
    const d = daysUntil(s.nextRenewal)
    return d !== null && d <= 14 && d >= 0
  })

  if (overdueCustIds.size > 0) {
    const names = [...overdueCustIds]
      .map((id) => getCustomer(id)?.name)
      .filter(Boolean)
      .join(', ')
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'High Churn Risk — Overdue Payments',
      text: `${overdueCustIds.size} customer(s) have overdue invoices: ${names}. Recommend sending payment reminders and offering a grace period or discount.`,
    })
  }

  if (expiringNoRenew.length > 0) {
    const names = expiringNoRenew
      .map((s) => getCustomer(s.customerId)?.name)
      .filter(Boolean)
      .join(', ')
    insights.push({
      type: 'warning',
      icon: '📉',
      title: 'Subscriptions Expiring Without Auto-Renew',
      text: `${expiringNoRenew.length} subscription(s) expire within 14 days without auto-renew: ${names}. Reach out with a renewal offer or enable auto-renew.`,
    })
  }

  const premiumSubs = subs.filter((s) => {
    if (s.status !== 'active') return false
    const p = getPlan(s.planId)
    return p && p.price >= 1500
  })
  if (premiumSubs.length > 0) {
    insights.push({
      type: 'success',
      icon: '💎',
      title: 'Premium Plan Adoption',
      text: `${premiumSubs.length} active premium/high-value subscriptions. Consider upselling Basic users with a limited-time upgrade offer.`,
    })
  }

  const inactive = customers.filter((c) => c.status === 'inactive' || c.status === 'churned')
  if (inactive.length > 0) {
    insights.push({
      type: 'info',
      icon: '🔄',
      title: 'Win-back Opportunity',
      text: `${inactive.length} inactive/churned customers. Launch a win-back campaign with a special re-join discount (e.g. 20% off first month).`,
    })
  }

  const pending = invoices.filter((i) => i.status === 'pending')
  if (pending.length > 0) {
    insights.push({
      type: 'info',
      icon: '💰',
      title: 'Pending Collections',
      text: `${pending.length} invoice(s) pending payment totaling ${formatCurrency(pending.reduce((s, i) => s + i.amount, 0))}. Automate reminder emails 3 days before due date.`,
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: 'success',
      icon: '✅',
      title: 'All Clear',
      text: 'No major risk signals detected. Keep monitoring renewals and payment status. AI will surface more insights as data grows.',
    })
  }

  const actions = [
    { title: 'Send renewal reminders', desc: 'For subscriptions expiring in next 7 days' },
    { title: 'Offer upgrade path', desc: 'Basic → Premium for long-tenure members' },
    { title: 'Enable auto-renew defaults', desc: 'New subscriptions default to auto-renew on' },
    { title: 'Segment inactive users', desc: 'Target with personalized win-back offers' },
  ]

  return (
    <>
      <div className="page-header">
        <h2>AI Insights</h2>
        <span className="badge badge-info">Heuristic analysis · Demo</span>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">🧠 Risk & Opportunity Signals</span>
        </div>
        <div className="card-body">
          {insights.map((ins, i) => (
            <div className="insight-card" key={i}>
              <div className={`insight-icon ${ins.type}`}>{ins.icon}</div>
              <div className="insight-content">
                <h4>{ins.title}</h4>
                <p>{ins.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recommended Actions</span>
        </div>
        <div className="card-body">
          <div className="grid-3">
            {actions.map((a) => (
              <div
                key={a.title}
                style={{
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <div style={{ fontWeight: 650, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-dim)' }}>
            Future: Full ML models will predict individual churn probability, optimal discount
            amounts, and best contact time based on your historical data.
          </p>
        </div>
      </div>
    </>
  )
}