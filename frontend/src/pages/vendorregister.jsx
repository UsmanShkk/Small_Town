import axios from "axios"
import { useNavigate, Link } from "react-router-dom" // ✅ keep Link
import { loginVendor, authVendor } from "./../api" // (unused, kept to avoid changing your module surface)
import { useState, useEffect } from "react"

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    foodType: "",
    location: null, // ✅ keep location in the payload
  })

  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vendor/me", {
          withCredentials: true,
        })
        const vendor = res.data.vendor

        if (vendor.status === "approved") {
          navigate("/vendor-panel/meals")
        } else if (vendor.status === "pending") {
          navigate("/vendor/status") // keep status flow
        } else if (vendor.status === "rejected") {
          setError("Your registration was rejected. Please contact support.")
        }
      } catch (err) {
        // Not logged in — allow registration
      }
    }

    checkAuth()

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
        }))
      },
      (error) => {
        console.warn("Geolocation failed or not allowed:", error.message)
        // If location is blocked, we just skip it
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await axios.post(
        "http://localhost:5000/api/vendor/register",
        formData,
        { withCredentials: true }
      )
      if (res.status === 201) {
        navigate("/vendor/status")
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFF7ED] to-white">
      {/* Top hero */}
      <div className="mx-auto max-w-3xl px-4 pt-10 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-orange-500 to-amber-500 text-white shadow-md">
          {/* Chef hat emoji for quick brand cue */}
          <span aria-hidden="true" className="text-xl">👨‍🍳</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Join Our Kitchen Network
        </h1>
        <p className="mt-2 text-gray-600">
          Create your vendor account to share your delicious offerings.
        </p>
      </div>

      {/* Card */}
      <div className="mx-auto mt-6 w-full max-w-md px-4">
        <div className="rounded-2xl border border-orange-100 bg-white/90 p-6 shadow-[0_10px_30px_rgba(255,153,0,0.08)] backdrop-blur">
          <div className="mb-5 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Vendor Registration</h2>
            <p className="mt-1 text-sm text-gray-500">Create your kitchen account</p>
          </div>

          {error ? (
            <div
              role="alert"
              className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 4.85V21h16v-2.15C20 16.17 16.33 14 12 14Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Restaurant or Owner Name"
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            {/* Email */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20 4H4a2 2 0 0 0-2 2v.4l10 5.6 10-5.6V6a2 2 0 0 0-2-2Zm0 4.2-8 4.4-8-4.4V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2Z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17 8V7a5 5 0 0 0-10 0v1H5v14h14V8Zm-8-1a3 3 0 0 1 6 0v1H9Zm8 13H7V10h10Z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {/* Address */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Address
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="address"
                  placeholder="Kitchen address"
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            {/* Food Type */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Food Type
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M21 7H3v2h18V7Zm-4 4H7l-2 9h14l-2-9Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="foodType"
                  placeholder="e.g. Indian, Pizza, Vegan"
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={formData.foodType}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            {/* Location capture indicator (no logic change) */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {formData.location ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 font-medium text-green-700">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 15.172 6.414 11.586 5 13l5 5 9-9-1.414-1.414z" />
                    </svg>
                    Location captured
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 font-medium text-gray-600">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V2z" />
                    </svg>
                    Waiting for location (optional)
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-b from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-70"
            >
              {submitting ? "Creating account..." : "Create Account"}
              <svg
                className="ml-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
              </svg>
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link to="/vendor-login" className="font-medium text-orange-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Feature bar */}
      <div className="mx-auto mt-8 max-w-4xl px-4 pb-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FeatureStat title="24/7" subtitle="Support" />
          <FeatureStat title="0%" subtitle="Setup Fee" />
          <FeatureStat title="Fast" subtitle="Payouts" />
          <FeatureStat title="Verified" subtitle="Vendors" />
        </div>
      </div>
    </div>
  )
}

function FeatureStat({ title, subtitle }) {
  return (
    <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
      <div className="text-xl font-extrabold text-orange-600">{title}</div>
      <div className="text-xs text-gray-600">{subtitle}</div>
    </div>
  )
}
