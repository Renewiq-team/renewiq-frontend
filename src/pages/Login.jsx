import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  const { login, signup } = useData()
  const { isDark, toggleTheme } = useTheme()
  const [tab, setTab] = useState('login')
  const [loginForm, setLoginForm] = useState({ email: 'admin@fitpro.gym', password: 'demo123' })
  const [signupForm, setSignupForm] = useState({
    businessName: '',
    name: '',
    email: '',
    password: '',
  })

  const handleLogin = (e) => {
    e.preventDefault()
    login(loginForm.email, loginForm.password)
  }

  const handleSignup = (e) => {
    e.preventDefault()
    signup(signupForm)
  }

  return (
    <div className="auth-screen" style={{ position: 'relative' }}>
      <button className="theme-toggle auth-theme-btn" onClick={toggleTheme} title="Toggle theme">
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">R</div>
          <h1>RenewIQ</h1>
        </div>
        <p className="auth-subtitle">Subscription management for modern businesses</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="you@business.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              Login to Dashboard
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Business Name</label>
              <input
                value={signupForm.businessName}
                onChange={(e) => setSignupForm({ ...signupForm, businessName: e.target.value })}
                placeholder="e.g. FitPro Gym"
                required
              />
            </div>
            <div className="form-group">
              <label>Your Name</label>
              <input
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                placeholder="you@business.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              Create Account
            </button>
          </form>
        )}

        <div className="auth-demo">
          <strong>Demo credentials:</strong>
          <br />
          Email: admin@fitpro.gym &nbsp;|&nbsp; Password: demo123
        </div>
      </div>
    </div>
  )
}