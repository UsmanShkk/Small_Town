import { useState } from 'react'
import { registerUser } from '../../api'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock, UserCheck, ChefHat, ArrowLeft, Sparkles } from 'lucide-react'

// Different background than Login: bright, appetizing bowls spread (warm, on-brand)
const BG_IMG =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&amp;fit=crop&amp;w=2400&amp;q=80'
const BG_FALLBACK =
  'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=2400&q=80' // breakfast spread

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid Gmail address ending in @gmail.com'
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const navigateToLogin = () => {
    navigate('/login')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await registerUser(form)
      alert('Registered successfully!')
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Background image and overlays */}
      <div className="absolute inset-0">
        <img
          src={BG_IMG || '/placeholder.svg'}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = BG_FALLBACK
          }}
          alt="Colorful bowls on a rustic table, top-down food spread"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center 45%' }}
          decoding="async"
          fetchPriority="high"
        />
        {/* Global darkening */}
        <div className="absolute inset-0 bg-black/45" />
        {/* Left vivid, right darker for the form */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/55 to-black/80" />
        {/* Warm brand vignette (different shape than login) */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1000px_520px_at_22%_38%,rgba(255,140,0,0.18),transparent_60%)]" />
        {/* Focus vignette at the form area */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(760px_420px_at_78%_50%,rgba(0,0,0,0.30),transparent_60%)]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="group flex items-center gap-2 text-white">
          <span className="rounded-xl bg-orange-500/90 p-2 shadow-lg ring-1 ring-white/10 transition group-hover:scale-105">
            <ChefHat className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-xl font-semibold tracking-tight">MealPro</span>
          <span className="sr-only">{'Go to home'}</span>
        </Link>

        <button
          onClick={navigateToLogin}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/90 backdrop-blur transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {'Back to Login'}
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-4 py-6 md:py-8">
        <div className="mx-auto grid max-w-6xl items-start gap-8 md:grid-cols-2">
          {/* Brand side */}
          <section className="hidden md:block text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-sm text-orange-200 ring-1 ring-orange-300/30">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {'Cook Smarter'}
            </div>
            <h1 className="text-4xl font-extrabold leading-tight">
              {'Join '}
              <span className="text-orange-400">{'MealPro'}</span>
              {' Today'}
            </h1>
            <ul className="mt-4 space-y-2 text-white/85">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/30 text-orange-200 ring-1 ring-orange-300/30">✓</span>
                {'Quick setup, no credit card'}
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/30 text-orange-200 ring-1 ring-orange-300/30">✓</span>
                {'Personalized meal plans'}
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/30 text-orange-200 ring-1 ring-orange-300/30">✓</span>
                {'Chef-approved recipes'}
              </li>
            </ul>
          </section>

          {/* Signup card – wider and a bit shorter overall */}
          <section className="w-full">
            <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white/88 p-5 shadow-2xl ring-1 ring-black/10 backdrop-blur supports-[backdrop-filter]:bg-white/70 md:p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
                  <UserCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{'Create Account'}</h2>
                <p className="text-xs text-gray-500">{'Join us'}</p>
              </div>

              {/* Two columns, tighter gaps, slightly shorter fields */}
              <form
                onSubmit={handleSubmit}
                className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                {/* Name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`h-11 w-full rounded-lg border bg-white pl-11 pr-3 text-[15px] outline-none transition placeholder:text-gray-400 ${
                        errors.name
                          ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@gmail.com"
                      className={`h-11 w-full rounded-lg border bg-white pl-11 pr-3 text-[15px] outline-none transition placeholder:text-gray-400 ${
                        errors.email
                          ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className={`h-11 w-full rounded-lg border bg-white pl-11 pr-11 text-[15px] outline-none transition placeholder:text-gray-400 ${
                        errors.password
                          ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={`h-11 w-full rounded-lg border bg-white pl-11 pr-11 text-[15px] outline-none transition placeholder:text-gray-400 ${
                        errors.confirmPassword
                          ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {!!form.confirmPassword && form.confirmPassword !== form.password && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                  )}
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>

                {/* Role + Submit on the same row to save height */}
                <div className="md:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Account Type</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-[15px] outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                    <option value="Chef">Chef</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>

                

                {/* Divider */}
                <div className="md:col-span-2">
                <div className="md:col-span-1 flex items-end">
                  <button
                    type="submit"
                    className="h-11 w-full rounded-lg bg-orange-600 px-4 text-[15px] font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
                  >
                    Create Account
                  </button>
                </div>
                  <div className="my-1 flex items-center">
                    <div className="h-px flex-grow bg-gray-300" />
                    
                    <span className="mx-3 text-xs text-gray-400">or</span>
                    <div className="h-px flex-grow bg-gray-300" />
                  </div>
                </div>

                {/* Google */}
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="h-11 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-[15px] shadow-sm transition hover:bg-gray-50"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    <span className="font-medium text-gray-700">Sign up with Google</span>
                  </button>
                </div>

                {/* Login link */}
                <div className="md:col-span-2 text-center">
                  <p className="text-sm text-gray-600">
                    {'Already have an account? '}
                    <button
                      onClick={navigateToLogin}
                      className="font-medium text-orange-700 underline underline-offset-4 transition hover:text-orange-800"
                    >
                      {'Sign in here'}
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* Footer */}
            <p className="mt-3 text-center text-[11px] text-white/80">
              {'By creating an account, you agree to our '}
              <a href="#" className="text-orange-300 underline-offset-4 hover:underline">
                {'Terms of Service'}
              </a>
              {' and '}
              <a href="#" className="text-orange-300 underline-offset-4 hover:underline">
                {'Privacy Policy'}
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-7 text-center text-[11px] text-white/70">
          {'© '}{new Date().getFullYear()}{' MealPro. All rights reserved.'}
        </p>
      </main>
    </div>
  )
}
