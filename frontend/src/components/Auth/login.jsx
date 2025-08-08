import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { loginUser } from '../../api'
import { ChefHat, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react'

const BG_IMG =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&amp;fit=crop&amp;w=2400&amp;q=80';
const BG_FALLBACK =
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&amp;fit=crop&amp;w=2400&amp;q=80';

export default function Login() {
const [form, setForm] = useState({ email: '', password: '' })
const [errorMsg, setErrorMsg] = useState('')
const [user, setUser] = useState(null)
const navigate = useNavigate()
const location = useLocation()

const hasRedirectedRef = useRef(false)

useEffect(() => {
  const controller = new AbortController()

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        credentials: 'include',
        signal: controller.signal,
      })
      if (!res.ok) return

      const data = await res.json()
      setUser(data.user)

      if (hasRedirectedRef.current) return

      const role = data.user?.role
      const target =
        role === 'Admin'
          ? '/admin-panel'
          : role === 'Customer'
          ? '/customer-panel'
          : null

      // Only navigate if we actually have a target and we're not already there
      if (target && location.pathname !== target) {
        hasRedirectedRef.current = true
        navigate(target, { replace: true })
      }
    } catch (err) {
      // ignore abort errors
      if (err?.name !== 'AbortError') {
        // optionally log
      }
    }
  }

  fetchUser()
  return () => controller.abort()
  // Important: don't include location.pathname here to avoid re-running
}, [navigate])

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value })
  setErrorMsg('')
}

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const res = await loginUser(form)
    alert('Login successful!')
    const role = res.data.user.role
    if (role === 'Admin') {
      navigate('/admin-panel')
    } else if (role === 'Customer') {
      navigate('/customer-panel')
    } else {
      navigate('/')
    }
  } catch (err) {
    if (err?.response?.data?.message) {
      setErrorMsg(err.response.data.message)
    } else {
      setErrorMsg('Something went wrong. Please try again.')
    }
  }
}

const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:5000/api/auth/google'
}

return (
  <div className="relative min-h-screen w-full">
    {/* Background hero to match the food-themed landing page */}
    <div className="absolute inset-0">
    <img
      src={BG_IMG || "/placeholder.svg"}
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = BG_FALLBACK
      }}
      alt="Rustic brunch spread with fresh ingredients on a wooden table"
      className="h-full w-full object-cover"
      style={{ objectPosition: 'center 45%' }}
      decoding="async"
      fetchPriority="high"
    />
    {/* Global darkening for contrast */}
    <div className="absolute inset-0 bg-black/45" />
    {/* Horizontal gradient: keep left vivid, right darker for the form */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/55 to-black/80" />
    {/* Warm vignette on the left to complement the brand orange */}
    <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_25%_40%,rgba(255,140,0,0.20),transparent_60%)]" />
    {/* Subtle vignette near the form area for legibility */}
    <div className="pointer-events-none absolute inset-0 [background:radial-gradient(800px_400px_at_80%_50%,rgba(0,0,0,0.35),transparent_60%)]" />
  </div>

    {/* Top bar matching brand */}
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="group flex items-center gap-2 text-white">
        <span className="rounded-xl bg-orange-500/90 p-2 shadow-lg ring-1 ring-white/10 transition group-hover:scale-105">
          <ChefHat className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-xl font-semibold tracking-tight">MealPro</span>
        <span className="sr-only">{'Go to home'}</span>
      </Link>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/90 backdrop-blur transition hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {'Back to Home'}
      </Link>
    </header>

    {/* Main content */}
    <main className="relative z-10 px-4 py-8 md:py-12">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        {/* Brand/Benefits side */}
        <section className="hidden md:block text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-sm text-orange-200 ring-1 ring-orange-300/30">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {'Smart Meal Planning'}
          </div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            {'Plan Your Perfect '}
            <span className="text-orange-400">{'Meals Effortlessly'}</span>
          </h1>
          <p className="mt-4 max-w-md text-white/80">
            {'Sign in to continue crafting AI-powered meal plans and explore chef-curated recipes tailored to your lifestyle.'}
          </p>
          <ul className="mt-6 space-y-3 text-white/85">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/30 text-orange-200 ring-1 ring-orange-300/30">
                {'✓'}
              </span>
              {'Personalized weekly plans'}
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/30 text-orange-200 ring-1 ring-orange-300/30">
                {'✓'}
              </span>
              {'Smart shopping lists'}
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/30 text-orange-200 ring-1 ring-orange-300/30">
                {'✓'}
              </span>
              {'Chef-approved recipes'}
            </li>
          </ul>
        </section>

        {/* Login card */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-md rounded-2xl bg-white/85 p-6 shadow-2xl ring-1 ring-black/10 backdrop-blur supports-[backdrop-filter]:bg-white/70 sm:p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
                <ChefHat className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{'Welcome Back'}</h2>
              <p className="text-sm text-gray-500">{'Login to continue'}</p>
            </div>

            {errorMsg && (
              <p className="mt-4 rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-700 ring-1 ring-red-200">
                {errorMsg}
              </p>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  {'Email Address'}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-gray-400">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300/80 bg-white px-10 py-2.5 text-gray-900 outline-none ring-orange-300/0 transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300/60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  {'Password'}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-gray-400">
                    <Lock className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-300/80 bg-white px-10 py-2.5 text-gray-900 outline-none ring-orange-300/0 transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
              >
                {'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              {'Don’t have an account? '}
              <Link to="/register" className="font-medium text-orange-700 underline underline-offset-4 hover:text-orange-800">
                {'Sign up'}
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/90 px-2 text-xs uppercase tracking-wide text-gray-400">{'Or continue with'}</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              {'Continue with Google'}
            </button>
          </div>
        </section>
      </div>

      <p className="mt-10 text-center text-xs text-white/70">
        {'© '}{new Date().getFullYear()}{' MealPro. All rights reserved.'}
      </p>
    </main>
  </div>
)
}
