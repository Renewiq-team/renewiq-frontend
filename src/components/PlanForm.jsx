import { useState } from 'react'
import Modal from './Modal'

export default function PlanForm({ plan, onSave, onClose }) {
  const [form, setForm] = useState({
    name: plan?.name || '',
    price: plan?.price || '',
    interval: plan?.interval || 'monthly',
    description: plan?.description || '',
    features: (plan?.features || []).join(', '),
    active: plan?.active !== false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return
    onSave({
      id: plan?.id,
      name: form.name.trim(),
      price: Number(form.price),
      interval: form.interval,
      description: form.description.trim(),
      features: form.features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      active: form.active,
    })
    onClose()
  }

  return (
    <Modal
      title={plan ? 'Edit Plan' : 'Create Plan'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {plan ? 'Update Plan' : 'Create Plan'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Plan Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Monthly Premium"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Price (₹) *</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="1999"
            />
          </div>
          <div className="form-group">
            <label>Billing Interval *</label>
            <select
              value={form.interval}
              onChange={(e) => setForm({ ...form, interval: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description"
          />
        </div>
        <div className="form-group">
          <label>Features (comma separated)</label>
          <input
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            placeholder="Gym access, Classes, Locker"
          />
        </div>
        {plan && (
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.active ? 'true' : 'false'}
              onChange={(e) => setForm({ ...form, active: e.target.value === 'true' })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        )}
      </form>
    </Modal>
  )
}