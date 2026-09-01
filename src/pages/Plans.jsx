import { useState } from 'react'
import { useData } from '../context/DataContext'
import { formatCurrency } from '../utils/helpers'
import PlanForm from '../components/PlanForm'

export default function Plans({ openForm, onCloseForm }) {
  const { getPlans, savePlan, deletePlan } = useData()
  const [editPlan, setEditPlan] = useState(null)
  const plans = getPlans()
  const showForm = openForm || editPlan

  return (
    <>
      <div className="page-header">
        <h2>Subscription Plans</h2>
        <button className="btn btn-primary" onClick={() => setEditPlan({})}>
          + Create Plan
        </button>
      </div>

      <div className="plans-grid">
        {plans.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">📦</div>
            <h3>No plans yet</h3>
            <p>Create plans that customers can subscribe to</p>
            <br />
            <button className="btn btn-primary" onClick={() => setEditPlan({})}>
              + Create Plan
            </button>
          </div>
        ) : (
          plans.map((p) => (
            <div className="plan-card" key={p.id}>
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">
                {formatCurrency(p.price)}
                <span>/{p.interval}</span>
              </div>
              <div className="plan-desc">{p.description || ''}</div>
              <ul className="plan-features">
                {(p.features || []).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div style={{ marginBottom: 12 }}>
                {p.active ? (
                  <span className="badge badge-success">Active</span>
                ) : (
                  <span className="badge badge-muted">Inactive</span>
                )}
              </div>
              <div className="plan-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => setEditPlan(p)}>
                  Edit
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => {
                    if (confirm('Delete this plan?')) deletePlan(p.id)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <PlanForm
          plan={editPlan?.id ? editPlan : null}
          onSave={savePlan}
          onClose={() => {
            setEditPlan(null)
            onCloseForm?.()
          }}
        />
      )}
    </>
  )
}