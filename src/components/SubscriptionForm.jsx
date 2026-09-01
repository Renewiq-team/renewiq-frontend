import { useState } from 'react'
import Modal from './Modal'
import { useData } from '../context/DataContext'
import { formatCurrency } from '../utils/helpers'

export default function SubscriptionForm({ onSave, onClose }) {
  const { getCustomers, getPlans, showToast } = useData()
  const customers = getCustomers().filter((c) => c.status === 'active')
  const plans = getPlans().filter((p) => p.active)

  const [form, setForm] = useState({
    customerId: customers[0]?.id || '',
    planId: plans[0]?.id || '',
    startDate: new Date().toISOString().slice(0, 10),
    amount: plans[0]?.price || 0,
    autoRenew: true,
  })

  if (customers.length === 0) {
    showToast('Add at least one active customer first', 'error')
    onClose()
    return null
  }
  if (plans.length === 0) {
    showToast('Create at least one plan first', 'error')
    onClose()
    return null
  }

  const handlePlanChange = (planId) => {
    const plan = plans.find((p) => p.id === planId)
    setForm({ ...form, planId, amount: plan?.price || 0 })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <Modal
      title="Create Subscription"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Create Subscription
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer *</label>
          <select
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Plan *</label>
          <select value={form.planId} onChange={(e) => handlePlanChange(e.target.value)}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatCurrency(p.price)}/{p.interval}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={form.autoRenew}
              onChange={(e) => setForm({ ...form, autoRenew: e.target.checked })}
              style={{ width: 'auto' }}
            />
            Auto-renew on expiry
          </label>
        </div>
      </form>
    </Modal>
  )
}