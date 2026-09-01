import { useState } from 'react'
import { useData } from '../context/DataContext'
import { formatCurrency, formatDate, avatarColor } from '../utils/helpers'
import StatusBadge from '../components/StatusBadge'
import SubscriptionForm from '../components/SubscriptionForm'

export default function Subscriptions({ openForm, onCloseForm }) {
  const {
    getSubscriptions,
    getCustomer,
    getPlan,
    saveSubscription,
    cancelSubscription,
    deleteSubscription,
  } = useData()
  const [filter, setFilter] = useState('all')

  const subs = getSubscriptions()
  const filtered = filter === 'all' ? subs : subs.filter((s) => s.status === filter)

  return (
    <>
      <div className="page-header">
        <h2>Subscriptions ({subs.length})</h2>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
          <button className="btn btn-primary" onClick={() => onCloseForm?.(false) || null}>
            {/* trigger via parent */}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              /* open form handled by parent or local */
            }}
            style={{ display: 'none' }}
          />
          <OpenSubButton openForm={openForm} onRequestOpen={() => onCloseForm?.(true)} />
        </div>
      </div>

      <div className="card">
        <div className="card-body no-pad">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔄</div>
              <h3>No subscriptions found</h3>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Start</th>
                    <th>Next Renewal</th>
                    <th>Amount</th>
                    <th>Auto Renew</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const c = getCustomer(s.customerId)
                    const p = getPlan(s.planId)
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
                          <StatusBadge status={s.status} />
                        </td>
                        <td>{formatDate(s.startDate)}</td>
                        <td>{formatDate(s.nextRenewal)}</td>
                        <td className="invoice-amount">{formatCurrency(s.amount)}</td>
                        <td>
                          {s.autoRenew ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                            <span className="badge badge-muted">No</span>
                          )}
                        </td>
                        <td>
                          {s.status === 'active' && (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--danger)' }}
                              onClick={() => {
                                if (confirm('Cancel this subscription?')) cancelSubscription(s.id)
                              }}
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              if (confirm('Permanently delete?')) deleteSubscription(s.id)
                            }}
                          >
                            Delete
                          </button>
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

      {openForm && (
        <SubscriptionForm onSave={saveSubscription} onClose={() => onCloseForm?.(false)} />
      )}
    </>
  )
}

function OpenSubButton({ onRequestOpen }) {
  return (
    <button className="btn btn-primary" onClick={onRequestOpen}>
      + Create Subscription
    </button>
  )
}