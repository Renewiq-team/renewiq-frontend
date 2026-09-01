import { useState } from 'react'
import { useData } from '../context/DataContext'
import { formatDate, avatarColor } from '../utils/helpers'
import StatusBadge from '../components/StatusBadge'
import CustomerForm from '../components/CustomerForm'

export default function Customers({ searchQuery, openForm, onCloseForm }) {
  const { getCustomers, getSubscriptions, saveCustomer, deleteCustomer } = useData()
  const [editCustomer, setEditCustomer] = useState(null)
  const [localSearch, setLocalSearch] = useState('')

  const search = (searchQuery || localSearch).toLowerCase()
  const customers = getCustomers()
  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      (c.phone || '').includes(search)
  )

  const showForm = openForm || editCustomer

  return (
    <>
      <div className="page-header">
        <h2>Customers ({customers.length})</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <button className="btn btn-primary" onClick={() => setEditCustomer({})}>
            + Add Customer
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body no-pad">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No customers found</h3>
              <p>Add your first customer to get started</p>
              <br />
              <button className="btn btn-primary" onClick={() => setEditCustomer({})}>
                + Add Customer
              </button>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Subscriptions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const subCount = getSubscriptions().filter(
                      (s) => s.customerId === c.id && s.status === 'active'
                    ).length
                    return (
                      <tr key={c.id}>
                        <td>
                          <div className="customer-cell">
                            <div className="avatar-sm" style={{ background: avatarColor(c.name) }}>
                              {c.name.charAt(0)}
                            </div>
                            <div className="info">
                              <div className="name">{c.name}</div>
                              <div className="sub">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{c.phone || '—'}</td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td>{formatDate(c.joinDate)}</td>
                        <td>{subCount} active</td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditCustomer(c)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => {
                              if (confirm('Delete this customer?')) deleteCustomer(c.id)
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

      {showForm && (
        <CustomerForm
          customer={editCustomer?.id ? editCustomer : null}
          onSave={saveCustomer}
          onClose={() => {
            setEditCustomer(null)
            onCloseForm?.()
          }}
        />
      )}
    </>
  )
}