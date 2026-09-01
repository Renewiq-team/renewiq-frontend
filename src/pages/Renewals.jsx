import { useData } from '../context/DataContext'
import { formatCurrency, formatDate, daysUntil, avatarColor } from '../utils/helpers'

export default function Renewals() {
  const { getSubscriptions, getCustomer, getPlan } = useData()

  const subs = getSubscriptions()
    .filter((s) => s.status === 'active' && s.nextRenewal)
    .map((s) => ({ ...s, days: daysUntil(s.nextRenewal) }))
    .sort((a, b) => a.days - b.days)

  return (
    <>
      <div className="page-header">
        <h2>Upcoming Renewals</h2>
      </div>

      <div className="card">
        <div className="card-body no-pad">
          {subs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⏰</div>
              <h3>No active renewals</h3>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Renewal Date</th>
                    <th>Days Left</th>
                    <th>Amount</th>
                    <th>Auto Renew</th>
                    <th>Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((s) => {
                    const c = getCustomer(s.customerId)
                    const p = getPlan(s.planId)
                    let urgency = 'badge-info'
                    let urgencyText = 'On track'
                    if (s.days < 0) {
                      urgency = 'badge-danger'
                      urgencyText = 'Overdue'
                    } else if (s.days <= 7) {
                      urgency = 'badge-danger'
                      urgencyText = 'Critical'
                    } else if (s.days <= 14) {
                      urgency = 'badge-warning'
                      urgencyText = 'Soon'
                    } else if (s.days <= 30) {
                      urgency = 'badge-info'
                      urgencyText = 'Upcoming'
                    }

                    const progress =
                      s.days < 0 ? 100 : Math.min(100, Math.max(0, 100 - (s.days / 30) * 100))
                    const progressClass =
                      s.days <= 7 ? 'danger' : s.days <= 14 ? 'warning' : ''

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
                        <td>{formatDate(s.nextRenewal)}</td>
                        <td>
                          {s.days < 0 ? s.days + 'd overdue' : s.days + ' days'}
                          <div className="progress-bar">
                            <div
                              className={`progress-fill ${progressClass}`}
                              style={{ width: progress + '%' }}
                            />
                          </div>
                        </td>
                        <td className="invoice-amount">{formatCurrency(s.amount)}</td>
                        <td>
                          {s.autoRenew ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                            <span className="badge badge-muted">No</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${urgency}`}>{urgencyText}</span>
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
    </>
  )
}