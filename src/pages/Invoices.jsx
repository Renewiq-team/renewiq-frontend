import { useState } from 'react'
import { useData } from '../context/DataContext'
import { formatCurrency, formatDate } from '../utils/helpers'
import StatusBadge from '../components/StatusBadge'

export default function Invoices() {
  const { getInvoices, getCustomer, markInvoicePaid } = useData()
  const [filter, setFilter] = useState('all')

  const invoices = getInvoices()
  const filtered = filter === 'all' ? invoices : invoices.filter((i) => i.status === filter)

  return (
    <>
      <div className="page-header">
        <h2>Invoices ({invoices.length})</h2>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-body no-pad">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧾</div>
              <h3>No invoices found</h3>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Paid Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => {
                    const c = getCustomer(inv.customerId)
                    return (
                      <tr key={inv.id}>
                        <td>
                          <strong>{inv.invoiceNumber}</strong>
                        </td>
                        <td>{c?.name || '—'}</td>
                        <td className="invoice-amount">{formatCurrency(inv.amount)}</td>
                        <td>{formatDate(inv.dueDate)}</td>
                        <td>{formatDate(inv.paidDate)}</td>
                        <td>
                          <StatusBadge status={inv.status} />
                        </td>
                        <td>
                          {inv.status !== 'paid' && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => markInvoicePaid(inv.id)}
                            >
                              Mark Paid
                            </button>
                          )}
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