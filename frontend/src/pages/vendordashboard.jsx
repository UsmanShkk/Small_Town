import { useEffect, useMemo, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  fetchVendorMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  authVendor,
} from "./../api"



export default function VendorDashboard() {
  const navigate = useNavigate()

  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState("")
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const [selectedImage, setSelectedImage] = useState(null) // File
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    nutrition: {
      calories: "",
      protein: "",
      carbohydrates: "",
      fat: "",
    },
    allergens: "",
    tags: "",
  })
  const [editId, setEditId] = useState(null)

  // Suggested stock images for food vendors (click to select)
  const stockImages = [
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553909489-cd47e0907980?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authVendor(); // This should fetch vendor info with credentials
        const vendor = res?.data?.vendor;
  
        if (!vendor) {
          console.log("No vendor data found. Redirecting to register.");
          navigate("/register-vendor");
          return;
        }
  
        console.log("Vendor authenticated:", vendor);
  
        if (vendor.status === "approved") {
          await loadMeals(); // Load meals only if approved
        } else if (vendor.status === "pending") {
          console.log("Vendor pending approval. Redirecting to status page.");
          navigate("/vendor/status");
        } else if (vendor.status === "rejected") {
          console.log("Vendor registration rejected.");
          navigate("/vendor/status");
        } else {
          console.log("Unknown vendor status. Redirecting.");
          navigate("/register-vendor");
        }
  
      } catch (err) {
        console.log("Vendor not authenticated. Redirecting to register.");
        navigate("/register-vendor");
      }
    };
  
    checkAuth();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const loadMeals = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetchVendorMeals()
      console.log("API returned:", res?.data)
      setMeals(Array.isArray(res?.data) ? res.data : [])
    } catch (err) {
      console.error("Failed to load meals:", err?.message)
      setError("Failed to load meals. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name in form.nutrition) {
      setForm((prev) => ({
        ...prev,
        nutrition: {
          ...prev.nutrition,
          [name]: value,
        },
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const onPickStockImage = (url) => {
    setForm((prev) => ({ ...prev, imageUrl: url }))
    setSelectedImage(null) // prefer URL if chosen
  }

  const onPickFile = (file) => {
    setSelectedImage(file || null)
    // Keep imageUrl if user clears file; user can remove manually
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setToast("")

    try {
      const formData = new FormData()
      formData.append("name", form.name.trim())
      formData.append("description", form.description.trim())

      // Price
      const priceNum = parseFloat(form.price)
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        throw new Error("Please enter a valid price.")
      }
      formData.append("price", priceNum)

      // Nutrition (append only if valid)
      const nutritionKeys = ["calories", "protein", "carbohydrates", "fat"]
      nutritionKeys.forEach((k) => {
        const v = parseFloat(form.nutrition[k])
        if (Number.isFinite(v)) {
          formData.append(`nutrition[${k}]`, v)
        }
      })

      // Allergens & Tags (append individually, filter empties)
      form.allergens
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
        .forEach((a) => formData.append("allergens", a))

      form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => formData.append("tags", t))

      // Image handling: prefer file, else send imageUrl if provided
      if (selectedImage) {
        formData.append("image", selectedImage)
      } else if (form.imageUrl?.trim()) {
        formData.append("imageUrl", form.imageUrl.trim())
      }

      if (editId) {
        await updateMeal(editId, formData)
        setToast("Meal updated successfully.")
      } else {
        await createMeal(formData)
        setToast("Meal created successfully.")
      }

      // Reset form
      setForm({
        name: "",
        description: "",
        imageUrl: "",
        price: "",
        nutrition: {
          calories: "",
          protein: "",
          carbohydrates: "",
          fat: "",
        },
        allergens: "",
        tags: "",
      })
      setSelectedImage(null)
      setEditId(null)
      await loadMeals()
    } catch (err) {
      console.error("Meal save failed:", err?.message)
      setError(err?.message || "Failed to save meal.")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (meal) => {
    setEditId(meal._id)
    setForm({
      name: meal.name ?? "",
      description: meal.description ?? "",
      imageUrl: "", // don't prefill the URL field; keep original image displayed below
      price: meal.price ?? "",
      nutrition: {
        calories: meal?.nutrition?.calories ?? "",
        protein: meal?.nutrition?.protein ?? "",
        carbohydrates: meal?.nutrition?.carbohydrates ?? "",
        fat: meal?.nutrition?.fat ?? "",
      },
      allergens: Array.isArray(meal.allergens) ? meal.allergens.join(", ") : "",
      tags: Array.isArray(meal.tags) ? meal.tags.join(", ") : "",
    })
    setSelectedImage(null) // clear previously selected file
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const confirmDelete = (id) => {
    setConfirmDeleteId(id)
  }

  const handleDelete = async (id) => {
    try {
      await deleteMeal(id)
      setToast("Meal deleted.")
      await loadMeals()
    } catch (err) {
      console.error("Delete failed:", err?.message)
      setError("Failed to delete meal. Please try again.")
    } finally {
      setConfirmDeleteId(null)
    }
  }

  // Filters / search
  const [query, setQuery] = useState("")
  const [tagFilter, setTagFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const allTags = useMemo(() => {
    const set = new Set()
    meals.forEach((m) => (m.tags || []).forEach((t) => set.add(t)))
    return ["all", ...Array.from(set)]
  }, [meals])

  const filteredMeals = useMemo(() => {
    let list = [...meals]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q)
      )
    }
    if (tagFilter !== "all") {
      list = list.filter((m) => (m.tags || []).includes(tagFilter))
    }
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
        break
      case "price-desc":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        break
      case "calories-asc":
        list.sort(
          (a, b) =>
            (a?.nutrition?.calories ?? 0) - (b?.nutrition?.calories ?? 0)
        )
        break
      case "calories-desc":
        list.sort(
          (a, b) =>
            (b?.nutrition?.calories ?? 0) - (a?.nutrition?.calories ?? 0)
        )
        break
      default:
        // newest (assume createdAt; fallback to original order)
        list.sort((a, b) => {
          const aT = new Date(a.createdAt || 0).getTime()
          const bT = new Date(b.createdAt || 0).getTime()
          return bT - aT
        })
    }
    return list
  }, [meals, query, tagFilter, sortBy])

  // Derived stats
  const stats = useMemo(() => {
    const count = meals.length
    const sumPrice = meals.reduce((acc, m) => acc + (Number(m.price) || 0), 0)
    const avgPrice = count ? sumPrice / count : 0
    const sumCalories = meals.reduce(
      (acc, m) => acc + (Number(m?.nutrition?.calories) || 0),
      0
    )
    const avgCalories = count ? sumCalories / count : 0
    const tagMap = new Map()
    meals.forEach((m) => (m.tags || []).forEach((t) => tagMap.set(t, (tagMap.get(t) || 0) + 1)))
    const topTag =
      Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
    return { count, avgPrice, avgCalories, topTag }
  }, [meals])

  const currency = (v) =>
    typeof v === "number" && !Number.isNaN(v) ? `$${v.toFixed(2)}` : "$0.00"

  const currentPreview = useMemo(() => {
    if (selectedImage) return URL.createObjectURL(selectedImage)
    if (form.imageUrl) return form.imageUrl
    return ""
  }, [selectedImage, form.imageUrl])

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {/* Home icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v10m4-10v10m-9 0h10a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v11z"
              />
            </svg>
            Home
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm text-gray-500">
              Vendor Dashboard
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop"
            alt="Assorted fresh meals background"
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Manage Your Menu
          </h1>
          <p className="mt-1 text-white/90">
            Create, update and curate delicious meals for your customers.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16">
        {/* Stats */}
        <section className="-mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Meals" value={String(stats.count)} />
          <StatCard label="Avg. Price" value={currency(stats.avgPrice)} />
          <StatCard
            label="Avg. Calories"
            value={`${Math.round(stats.avgCalories || 0)} kcal`}
          />
          <StatCard label="Top Tag" value={stats.topTag} />
        </section>

        {/* Form */}
        <section className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editId ? "Edit Meal" : "Create New Meal"}
            </h2>
            {editId && (
              <button
                className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-800"
                onClick={() => {
                  setEditId(null)
                  setForm({
                    name: "",
                    description: "",
                    imageUrl: "",
                    price: "",
                    nutrition: {
                      calories: "",
                      protein: "",
                      carbohydrates: "",
                      fat: "",
                    },
                    allergens: "",
                    tags: "",
                  })
                  setSelectedImage(null)
                }}
              >
                Cancel edit
              </button>
            )}
          </div>

          {error ? (
            <div
              className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          ) : null}
          {toast ? (
            <div
              className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              role="status"
            >
              {toast}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Name"
                  name="name"
                  placeholder="Ex: Grilled Chicken Bowl"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Price"
                  name="price"
                  type="number"
                  placeholder="12.99"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Tags (comma-separated)"
                  name="tags"
                  placeholder="healthy, gluten-free, lunch"
                  value={form.tags}
                  onChange={handleChange}
                />
                <FormInput
                  label="Allergens (comma-separated)"
                  name="allergens"
                  placeholder="peanuts, dairy"
                  value={form.allergens}
                  onChange={handleChange}
                />
              </div>

              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-gray-700">
                  Nutrition (per serving)
                </legend>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <FormInput
                    label="Calories"
                    name="calories"
                    placeholder="520"
                    value={form.nutrition.calories}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Protein (g)"
                    name="protein"
                    placeholder="35"
                    value={form.nutrition.protein}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Carbs (g)"
                    name="carbohydrates"
                    placeholder="48"
                    value={form.nutrition.carbohydrates}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Fat (g)"
                    name="fat"
                    placeholder="18"
                    value={form.nutrition.fat}
                    onChange={handleChange}
                    required
                  />
                </div>
              </fieldset>

              <div>
                <FormTextArea
                  label="Description"
                  name="description"
                  placeholder="Briefly describe the dish, ingredients, and taste profile."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className={`inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  {saving ? (editId ? "Updating..." : "Adding...") : editId ? "Update Meal" : "Add Meal"}
                </button>
                <button
                  type="button"
                  onClick={() => loadMeals()}
                  className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Right column - Images */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Image upload
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => onPickFile(e.target.files?.[0])}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload a photo or choose a stock image below.
                </p>
              </div>

              <div>
                <FormInput
                  label="Or paste image URL"
                  name="imageUrl"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Preview */}
              {currentPreview ? (
                <div>
                  <div className="relative overflow-hidden rounded-lg border">
                    <img
                      src={currentPreview || "/placeholder.svg"}
                      alt="Selected meal preview"
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null)
                        setForm((prev) => ({ ...prev, imageUrl: "" }))
                      }}
                      className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                  No image selected
                </div>
              )}

              {/* Stock images */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Stock images</p>
                <div className="grid grid-cols-3 gap-2">
                  {stockImages.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => onPickStockImage(url)}
                      className="group relative overflow-hidden rounded-md border"
                      title="Use this image"
                    >
                      <img
                        src={url || "/placeholder.svg"}
                        alt="Food example"
                        className="aspect-video w-full object-cover transition group-hover:scale-[1.02]"
                      />
                      <span className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Current image when editing (read-only display) */}
              {editId && (
                <EditImageHint meals={meals} id={editId} />
              )}
            </div>
          </form>
        </section>

        {/* Filters */}
        <section className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search meals..."
                className="w-72 rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="pointer-events-none absolute right-2 top-2 text-gray-400">
                {/* magnifier */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                </svg>
              </span>
            </div>

            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              aria-label="Filter by tag"
            >
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All tags" : t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              aria-label="Sort meals"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="calories-asc">Calories ↑</option>
              <option value="calories-desc">Calories ↓</option>
            </select>
          </div>
        </section>

        {/* Meals list */}
        <section className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredMeals.length === 0 ? (
            <EmptyState onCreateClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMeals.map((meal) => (
                <li key={meal._id} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
                  <div className="relative">
                    <img
                      src={meal.imageUrl || `https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop`}
                      alt={meal.name || "Meal image"}
                      className="aspect-video w-full object-cover"
                    />
                    <div className="absolute right-2 top-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(meal)}
                        className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-800 shadow hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(meal._id)}
                        className="rounded-md bg-red-600/90 px-2 py-1 text-xs font-medium text-white shadow hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">{meal.name}</h3>
                      <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-semibold text-emerald-700">
                        {currency(Number(meal.price))}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{meal.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(meal.tags || []).slice(0, 4).map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-gray-600">
                      <NutriBadge label="Cal" value={meal?.nutrition?.calories} />
                      <NutriBadge label="P" value={meal?.nutrition?.protein} />
                      <NutriBadge label="C" value={meal?.nutrition?.carbohydrates} />
                      <NutriBadge label="F" value={meal?.nutrition?.fat} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Confirm delete */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl border bg-white p-5 shadow-lg">
            <h4 className="text-base font-semibold">Delete meal?</h4>
            <p className="mt-1 text-sm text-gray-600">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* UI helpers */

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function FormInput(props) {
  const { label, name, ...rest } = props
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input
        name={name}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        {...rest}
      />
    </label>
  )
}

function FormTextArea(props) {
  const { label, name, ...rest } = props
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        name={name}
        rows={4}
        className="block w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        {...rest}
      />
    </label>
  )
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
      {children}
    </span>
  )
}

function NutriBadge({ label, value }) {
  const v = Number(value)
  const display = Number.isFinite(v) ? v : "—"
  return (
    <div className="rounded-md border bg-gray-50 px-2 py-1">
      <span className="font-semibold text-gray-700">{display}</span>
      <span className="ml-1 text-gray-500">{label}</span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="h-36 w-full animate-pulse bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
        <div className="flex gap-2">
          <div className="h-5 w-12 animate-pulse rounded-full bg-gray-100" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onCreateClick }) {
  return (
    <div className="rounded-xl border border-dashed bg-white p-10 text-center">
      <h3 className="text-lg font-semibold">No meals yet</h3>
      <p className="mt-1 text-sm text-gray-600">
        Start by adding your first meal. Upload a photo, set nutrition, and you’re ready to go.
      </p>
      <button
        onClick={onCreateClick}
        className="mt-4 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
      >
        Create Meal
      </button>
    </div>
  )
}

function EditImageHint({ meals, id }) {
  const meal = meals.find((m) => m._id === id)
  if (!meal?.imageUrl) return null
  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <p className="text-xs text-gray-600">
        Current image
      </p>
      <img
        src={meal.imageUrl || "/placeholder.svg"}
        alt="Current meal"
        className="mt-2 aspect-video w-full rounded-md object-cover"
      />
    </div>
  )
}