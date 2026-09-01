import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { defaultData } from '../utils/defaultData'
import { uid } from '../utils/helpers'

const STORAGE_KEY = 'renewiq_data_v1'
const DataContext = createContext(null)

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return JSON.parse(JSON.stringify(defaultData))
}

export function DataProvider({ children }) {
  const [store, setStore] = useState(loadInitial)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  }, [store])

  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const bizId = store.currentBusinessId
  const currentBiz = store.businesses.find((b) => b.id === bizId) || null

  const getPlans = () => store.plans[bizId] || []
  const getCustomers = () => store.customers[bizId] || []
  const getSubscriptions = () => store.subscriptions[bizId] || []
  const getInvoices = () => store.invoices[bizId] || []

  const getCustomer = (id) => getCustomers().find((c) => c.id === id)
  const getPlan = (id) => getPlans().find((p) => p.id === id)

  // Auth
  const login = (email, password) => {
    const biz = store.businesses.find(
      (b) => b.email.toLowerCase() === email.toLowerCase() && b.password === password
    )
    if (!biz) {
      showToast('Invalid email or password', 'error')
      return false
    }
    setStore((s) => ({ ...s, currentBusinessId: biz.id }))
    showToast('Welcome back, ' + biz.ownerName + '!', 'success')
    return true
  }

  const signup = ({ businessName, name, email, password }) => {
    if (store.businesses.some((b) => b.email.toLowerCase() === email.toLowerCase())) {
      showToast('Email already registered', 'error')
      return false
    }
    const id = uid('biz')
    const biz = {
      id,
      name: businessName,
      email: email.toLowerCase(),
      password,
      ownerName: name,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setStore((s) => ({
      ...s,
      businesses: [...s.businesses, biz],
      plans: {
        ...s.plans,
        [id]: [
          {
            id: uid('plan'),
            name: 'Basic Monthly',
            price: 999,
            interval: 'monthly',
            description: 'Starter plan',
            features: ['Core access'],
            active: true,
          },
        ],
      },
      customers: { ...s.customers, [id]: [] },
      subscriptions: { ...s.subscriptions, [id]: [] },
      invoices: { ...s.invoices, [id]: [] },
      currentBusinessId: id,
    }))
    showToast('Account created successfully!', 'success')
    return true
  }

  const logout = () => {
    setStore((s) => ({ ...s, currentBusinessId: null }))
    showToast('Logged out', 'info')
  }

  // Customers
  const saveCustomer = (data) => {
    setStore((s) => {
      const list = [...(s.customers[bizId] || [])]
      if (data.id) {
        const idx = list.findIndex((c) => c.id === data.id)
        if (idx >= 0) list[idx] = { ...list[idx], ...data }
      } else {
        list.push({
          id: uid('cust'),
          ...data,
          joinDate: new Date().toISOString().slice(0, 10),
        })
      }
      return { ...s, customers: { ...s.customers, [bizId]: list } }
    })
    showToast(data.id ? 'Customer updated' : 'Customer added', 'success')
  }

  const deleteCustomer = (id) => {
    setStore((s) => ({
      ...s,
      customers: {
        ...s.customers,
        [bizId]: (s.customers[bizId] || []).filter((c) => c.id !== id),
      },
    }))
    showToast('Customer deleted', 'info')
  }

  // Plans
  const savePlan = (data) => {
    setStore((s) => {
      const list = [...(s.plans[bizId] || [])]
      if (data.id) {
        const idx = list.findIndex((p) => p.id === data.id)
        if (idx >= 0) list[idx] = { ...list[idx], ...data }
      } else {
        list.push({ id: uid('plan'), active: true, ...data })
      }
      return { ...s, plans: { ...s.plans, [bizId]: list } }
    })
    showToast(data.id ? 'Plan updated' : 'Plan created', 'success')
  }

  const deletePlan = (id) => {
    setStore((s) => ({
      ...s,
      plans: {
        ...s.plans,
        [bizId]: (s.plans[bizId] || []).filter((p) => p.id !== id),
      },
    }))
    showToast('Plan deleted', 'info')
  }

  // Subscriptions
  const saveSubscription = ({ customerId, planId, startDate, amount, autoRenew }) => {
    const plan = getPlan(planId)
    if (!plan) return

    const start = new Date(startDate)
    const end = new Date(start)
    if (plan.interval === 'monthly') end.setMonth(end.getMonth() + 1)
    else if (plan.interval === 'quarterly') end.setMonth(end.getMonth() + 3)
    else if (plan.interval === 'yearly') end.setFullYear(end.getFullYear() + 1)
    else end.setMonth(end.getMonth() + 1)

    const endStr = end.toISOString().slice(0, 10)
    const subId = uid('sub')

    setStore((s) => {
      const subs = [...(s.subscriptions[bizId] || [])]
      subs.push({
        id: subId,
        customerId,
        planId,
        status: 'active',
        startDate,
        endDate: endStr,
        nextRenewal: endStr,
        amount,
        autoRenew,
      })

      const invs = [...(s.invoices[bizId] || [])]
      const invCount = invs.length + 1
      invs.push({
        id: uid('inv'),
        customerId,
        subscriptionId: subId,
        amount,
        status: 'paid',
        dueDate: startDate,
        paidDate: startDate,
        invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + String(invCount).padStart(3, '0'),
      })

      return {
        ...s,
        subscriptions: { ...s.subscriptions, [bizId]: subs },
        invoices: { ...s.invoices, [bizId]: invs },
      }
    })
    showToast('Subscription created & invoice generated', 'success')
  }

  const cancelSubscription = (id) => {
    setStore((s) => {
      const list = (s.subscriptions[bizId] || []).map((sub) =>
        sub.id === id ? { ...sub, status: 'cancelled', autoRenew: false, nextRenewal: null } : sub
      )
      return { ...s, subscriptions: { ...s.subscriptions, [bizId]: list } }
    })
    showToast('Subscription cancelled', 'info')
  }

  const deleteSubscription = (id) => {
    setStore((s) => ({
      ...s,
      subscriptions: {
        ...s.subscriptions,
        [bizId]: (s.subscriptions[bizId] || []).filter((sub) => sub.id !== id),
      },
    }))
    showToast('Subscription deleted', 'info')
  }

  // Invoices
  const markInvoicePaid = (id) => {
    setStore((s) => {
      const list = (s.invoices[bizId] || []).map((inv) =>
        inv.id === id
          ? { ...inv, status: 'paid', paidDate: new Date().toISOString().slice(0, 10) }
          : inv
      )
      return { ...s, invoices: { ...s.invoices, [bizId]: list } }
    })
    showToast('Invoice marked as paid', 'success')
  }

  const value = {
    store,
    currentBiz,
    isLoggedIn: !!bizId,
    toasts,
    showToast,
    login,
    signup,
    logout,
    getPlans,
    getCustomers,
    getSubscriptions,
    getInvoices,
    getCustomer,
    getPlan,
    saveCustomer,
    deleteCustomer,
    savePlan,
    deletePlan,
    saveSubscription,
    cancelSubscription,
    deleteSubscription,
    markInvoicePaid,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}