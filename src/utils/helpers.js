export function formatCurrency(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}

export function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24))
}

export function avatarColor(name) {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6']
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function uid(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function statusBadgeClass(status) {
  const map = {
    active: 'badge-success',
    paid: 'badge-success',
    pending: 'badge-warning',
    overdue: 'badge-danger',
    cancelled: 'badge-danger',
    churned: 'badge-danger',
    inactive: 'badge-muted',
    expired: 'badge-muted',
  }
  return map[status] || 'badge-muted'
}