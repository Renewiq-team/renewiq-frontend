import { useData } from '../context/DataContext'

export default function Toast() {
  const { toasts } = useData()
  const icons = { success: '✓', error: '✕', info: 'ℹ' }

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{icons[t.type] || 'ℹ'}</span>
          {t.msg}
        </div>
      ))}
    </div>
  )
}