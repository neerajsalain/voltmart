'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ─── Constants ───────────────────────────────────────────────────────────────
const API = '/api/admin'
const UPLOAD_API = '/api/upload'
const CATEGORIES = ['Lighting', 'Fans', 'Wiring', 'Switches', 'Tools', 'Other']
const DEFAULT_TOKEN = 'voltmart-admin-secret-token'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

function fmt(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} onClick={() => remove(t.id)}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium cursor-pointer transition-all
            ${t.type === 'success' ? 'bg-emerald-500 text-white' : t.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-700 text-white'}`}>
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

function useToast() {
  const [toasts, setToasts] = useState([])
  const add = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), [])
  return { toasts, toast: add, remove }
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <p className="text-white text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition font-medium">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ─── Login Page ──────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@voltmart.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill all fields'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      onLogin(data.token, data.admin)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(rgba(251,191,36,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center">
              <span className="text-slate-900 font-black text-lg">⚡</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">VoltMart</span>
          </div>
          <p className="text-slate-400 text-sm">Admin Control Panel</p>
        </div>

        <div className="bg-[#161b27] border border-white/8 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-6">Sign in to Admin</h1>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder="admin@voltmart.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)}
                type="password" placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-900 font-bold rounded-xl transition-all text-sm">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Default: admin@voltmart.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-[#161b27] border border-white/8 rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-slate-400 text-xs font-medium">{label}</p>
        <p className="text-white text-xl font-bold mt-0.5">{value}</p>
      </div>
    </div>
  )
}

// ─── Image Upload ─────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange, token }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const fileRef = useRef()

  useEffect(() => { setPreview(value || '') }, [value])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // local preview
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch(UPLOAD_API, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onChange(data.url)
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 font-medium">Product Image</label>
      <div
        onClick={() => fileRef.current?.click()}
        className="relative w-full h-36 border-2 border-dashed border-white/15 rounded-xl overflow-hidden cursor-pointer hover:border-amber-400/50 transition group">
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-sm font-medium">Change Image</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
            <span className="text-3xl">{uploading ? '⏳' : '📷'}</span>
            <span className="text-xs">{uploading ? 'Uploading…' : 'Click to upload (JPG, PNG, WEBP)'}</span>
          </div>
        )}
        {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-amber-400 text-sm">Uploading…</span></div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* URL fallback */}
      <input
        value={value || ''}
        onChange={e => { onChange(e.target.value); setPreview(e.target.value) }}
        placeholder="Or paste image URL…"
        className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition" />
    </div>
  )
}

// ─── Product Form Modal ───────────────────────────────────────────────────────
function ProductModal({ product, token, onClose, onSaved, toast }) {
  const isEdit = !!product?.id
  const [form, setForm] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || 'Lighting',
    price: product?.price || '',
    mrp: product?.mrp || '',
    stock: product?.stock ?? '',
    description: product?.description || '',
    features: (product?.features || []).join(', '),
    tags: (product?.tags || []).join(', '),
    image: product?.image || '',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price is required'
    if (!form.category) e.category = 'Category is required'
    if (form.stock !== '' && isNaN(Number(form.stock))) e.stock = 'Stock must be a number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp || form.price),
        stock: Number(form.stock || 0),
        features: form.features.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      }
      let res, data
      if (isEdit) {
        res = await fetch(`${API}?id=${product.id}`, {
          method: 'PUT',
          headers: authHeaders(token),
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`${API}?action=add-product`, {
          method: 'POST',
          headers: authHeaders(token),
          body: JSON.stringify(payload),
        })
      }
      data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast(isEdit ? 'Product updated!' : 'Product added!', 'success')
      onSaved()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition
          ${errors[key] ? 'border-red-500/60' : 'border-white/10'}`} />
      {errors[key] && <p className="mt-1 text-xs text-red-400">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-[#161b27] border border-white/10 rounded-2xl w-full max-w-xl my-8 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-white font-bold text-lg">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ImageUpload value={form.image} onChange={v => set('image', v)} token={token} />

          {field('Product Name *', 'name', 'text', 'e.g. Philips 9W LED Bulb')}
          {field('Brand', 'brand', 'text', 'e.g. Philips')}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition">
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1f2e]">{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {field('Price (₹) *', 'price', 'number', '0')}
            {field('MRP (₹)', 'mrp', 'number', '0')}
            {field('Stock', 'stock', 'number', '0')}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Product description…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition resize-none" />
          </div>

          {field('Features (comma-separated)', 'features', 'text', 'e.g. 9W, E27 Base, 15000hr')}
          {field('Tags (comma-separated)', 'tags', 'text', 'e.g. bestseller, eco')}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-900 font-bold rounded-xl transition text-sm">
              {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onEdit, onDelete }) {
  const discount = product.mrp && product.mrp > product.price
    ? Math.round((1 - product.price / product.mrp) * 100) : 0

  return (
    <div className="bg-[#161b27] border border-white/8 rounded-2xl overflow-hidden hover:border-amber-400/30 transition group">
      <div className="relative h-44 bg-slate-800 overflow-hidden">
        <img
          src={product.image || '/products/placeholder.webp'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23334155" width="200" height="200"/><text x="50%" y="50%" fill="%2394a3b8" font-size="40" text-anchor="middle" dy=".3em">📦</text></svg>' }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">{discount}% OFF</span>
        )}
        {product.stock < 10 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">Low Stock</span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-amber-400 font-medium mb-1">{product.brand || product.category}</p>
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-white font-bold">{fmt(product.price)}</span>
          {discount > 0 && <span className="text-slate-500 text-xs line-through">{fmt(product.mrp)}</span>}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="bg-white/5 px-2 py-1 rounded-lg">{product.category}</span>
          <span>Stock: <span className={product.stock < 10 ? 'text-red-400 font-bold' : 'text-slate-300'}>{product.stock}</span></span>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onEdit(product)}
            className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 text-xs transition">
            ✏️ Edit
          </button>
          <button onClick={() => onDelete(product)}
            className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-xs transition">
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Orders Table ─────────────────────────────────────────────────────────────
function OrdersPanel({ token, toast }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}?resource=orders`, { headers: authHeaders(token) })
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch { toast('Failed to load orders', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`${API}?action=update-order`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error()
      toast('Order status updated', 'success')
      load()
    } catch { toast('Failed to update order', 'error') }
  }

  async function deleteOrder(id) {
    try {
      const res = await fetch(`${API}?id=${id}&resource=order`, { method: 'DELETE', headers: authHeaders(token) })
      if (!res.ok) throw new Error()
      toast('Order deleted', 'success')
      setOrders(p => p.filter(o => o.id !== id))
    } catch { toast('Failed to delete order', 'error') }
    finally { setConfirm(null) }
  }

  const statusColor = s => ({
    confirmed: 'text-emerald-400 bg-emerald-400/10',
    pending: 'text-amber-400 bg-amber-400/10',
    shipped: 'text-blue-400 bg-blue-400/10',
    delivered: 'text-purple-400 bg-purple-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
  }[s] || 'text-slate-400 bg-slate-400/10')

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading orders…</div>

  return (
    <div>
      <ConfirmDialog
        open={!!confirm}
        message="Delete this order permanently?"
        onConfirm={() => deleteOrder(confirm)}
        onCancel={() => setConfirm(null)}
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">Orders <span className="text-slate-500 font-normal text-base">({orders.length})</span></h2>
        <button onClick={load} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm hover:bg-white/10 transition">↻ Refresh</button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No orders yet</div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-[#161b27] border border-white/8 rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-white font-semibold text-sm">#{order.id?.slice(0, 8).toUpperCase()}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{order.customer?.name} · {order.customer?.email}</p>
                  <p className="text-slate-500 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(order.status)}`}>{order.status}</span>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50">
                    {['confirmed', 'pending', 'shipped', 'delivered', 'cancelled'].map(s =>
                      <option key={s} value={s} className="bg-[#1a1f2e]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    )}
                  </select>
                  <button onClick={() => setConfirm(order.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition text-sm">🗑</button>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 flex flex-wrap gap-x-6 gap-y-1">
                {(order.items || []).map((item, i) => (
                  <span key={i} className="text-slate-400 text-xs">{item.name} × {item.qty || item.quantity || 1}</span>
                ))}
              </div>
              <div className="mt-2 text-right text-white font-bold text-sm">{fmt(order.total)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Cart Panel ───────────────────────────────────────────────────────────────
function CartPanel({ token, toast }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' })
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    fetch(`${API}?resource=products`, { headers: authHeaders(token) })
      .then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  function addToCart(p) {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id)
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...p, qty: 1 }]
    })
  }

  function removeFromCart(id) { setCart(p => p.filter(i => i.id !== id)) }
  function updateQty(id, qty) {
    if (qty < 1) { removeFromCart(id); return }
    setCart(p => p.map(i => i.id === id ? { ...i, qty } : i))
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))

  async function placeOrder() {
    if (!cart.length) { toast('Cart is empty', 'error'); return }
    if (!customer.name || !customer.email) { toast('Customer name and email required', 'error'); return }
    setPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, quantity: i.qty })),
          customer,
          total,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast('Order placed successfully!', 'success')
      setCart([])
      setCustomer({ name: '', email: '', phone: '', address: '' })
    } catch (err) {
      toast(err.message || 'Order failed', 'error')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Products */}
      <div>
        <h2 className="text-white text-xl font-bold mb-4">Products</h2>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 mb-4 transition" />

        {loading ? <div className="text-slate-400 text-sm">Loading…</div> : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {filtered.map(p => (
              <div key={p.id} className="flex items-center gap-3 bg-[#161b27] border border-white/8 rounded-xl p-3">
                <img src={p.image} alt={p.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-700 flex-shrink-0"
                  onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect fill="%23334155" width="48" height="48"/><text x="50%" y="50%" fill="%2394a3b8" font-size="24" text-anchor="middle" dy=".3em">📦</text></svg>' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{p.name}</p>
                  <p className="text-amber-400 text-xs">{fmt(p.price)}</p>
                </div>
                <button onClick={() => addToCart(p)}
                  className="flex-shrink-0 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-lg text-xs transition">
                  + Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart + Order */}
      <div>
        <h2 className="text-white text-xl font-bold mb-4">Cart & Order</h2>

        {/* Customer info */}
        <div className="bg-[#161b27] border border-white/8 rounded-2xl p-4 mb-4 space-y-2">
          <p className="text-slate-400 text-xs font-medium mb-2">Customer Details</p>
          {[['name', 'Customer Name *'], ['email', 'Email *'], ['phone', 'Phone'], ['address', 'Address']].map(([k, label]) => (
            <input key={k} value={customer[k]} onChange={e => setCustomer(p => ({ ...p, [k]: e.target.value }))}
              placeholder={label}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition" />
          ))}
        </div>

        {/* Cart items */}
        <div className="bg-[#161b27] border border-white/8 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium mb-3">Cart Items</p>
          {cart.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Add products from the list →</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <p className="flex-1 text-white text-xs truncate">{item.name}</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 transition">−</button>
                    <span className="text-white text-xs w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 transition">+</button>
                  </div>
                  <span className="text-amber-400 text-xs w-20 text-right">{fmt(item.price * item.qty)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-xs transition">✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-white/8 pt-3 flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Total</span>
            <span className="text-white font-bold text-lg">{fmt(total)}</span>
          </div>

          <button onClick={placeOrder} disabled={placing || !cart.length}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-900 font-bold rounded-xl transition text-sm">
            {placing ? 'Placing Order…' : '✓ Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Products Panel ───────────────────────────────────────────────────────────
function ProductsPanel({ token, toast }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [modal, setModal] = useState(null) // null | 'add' | product obj
  const [confirm, setConfirm] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}?resource=products`, { headers: authHeaders(token) })
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch { toast('Failed to load products', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function deleteProduct(id) {
    try {
      const res = await fetch(`${API}?id=${id}`, { method: 'DELETE', headers: authHeaders(token) })
      if (!res.ok) throw new Error()
      toast('Product deleted', 'success')
      setProducts(p => p.filter(x => x.id !== id))
    } catch { toast('Failed to delete', 'error') }
    finally { setConfirm(null) }
  }

  const filtered = products.filter(p => {
    const matchCat = filterCat === 'All' || p.category === filterCat
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      <ConfirmDialog
        open={!!confirm}
        message={`Delete "${confirm?.name}"? This cannot be undone.`}
        onConfirm={() => deleteProduct(confirm?.id)}
        onCancel={() => setConfirm(null)}
      />

      {modal !== null && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          token={token}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
          toast={toast}
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-white text-xl font-bold">Products <span className="text-slate-500 font-normal text-base">({filtered.length})</span></h2>
        <div className="flex flex-wrap items-center gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 w-48 transition" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50">
            <option value="All" className="bg-[#1a1f2e]">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1f2e]">{c}</option>)}
          </select>
          <button onClick={() => setModal('add')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-sm transition">
            + Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#161b27] border border-white/8 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">📦</p>
          <p>No products found</p>
          <button onClick={() => setModal('add')} className="mt-4 px-4 py-2 bg-amber-400 text-slate-900 font-bold rounded-xl text-sm">Add First Product</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p}
              onEdit={setModal}
              onDelete={setConfirm} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Dashboard Overview ────────────────────────────────────────────────────────
function DashboardPanel({ token, toast, onNav }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}?resource=stats`, { headers: authHeaders(token) })
      .then(r => r.json()).then(setStats)
      .catch(() => toast('Failed to load stats', 'error'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="text-white text-xl font-bold mb-6">Dashboard</h2>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-[#161b27] border border-white/8 rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Products" value={stats?.productCount ?? 0} icon="📦" color="bg-amber-400/10" />
          <StatCard label="Total Orders" value={stats?.orderCount ?? 0} icon="📋" color="bg-blue-400/10" />
          <StatCard label="Total Revenue" value={fmt(stats?.revenue ?? 0)} icon="💰" color="bg-emerald-400/10" />
          <StatCard label="Low Stock Items" value={stats?.lowStock ?? 0} icon="⚠️" color="bg-red-400/10" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: '📦', label: 'Manage Products', desc: 'Add, edit or remove products', tab: 'products', color: 'amber' },
          { icon: '📋', label: 'View Orders', desc: 'Track and update order statuses', tab: 'orders', color: 'blue' },
          { icon: '🛒', label: 'Create Order', desc: 'Manually create a new order', tab: 'cart', color: 'emerald' },
        ].map(item => (
          <button key={item.tab} onClick={() => onNav(item.tab)}
            className="bg-[#161b27] border border-white/8 hover:border-amber-400/30 rounded-2xl p-6 text-left transition group">
            <span className="text-3xl block mb-3">{item.icon}</span>
            <p className="text-white font-semibold">{item.label}</p>
            <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main Admin App ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('admin_token') || ''
    return ''
  })
  const [admin, setAdmin] = useState(null)
  const [tab, setTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toasts, toast, remove } = useToast()

  function handleLogin(t, a) {
    setToken(t)
    setAdmin(a)
    localStorage.setItem('admin_token', t)
  }

  function handleLogout() {
    setToken('')
    setAdmin(null)
    localStorage.removeItem('admin_token')
  }

  // Validate stored token on mount
  useEffect(() => {
    const stored = localStorage.getItem('admin_token')
    if (stored && stored !== DEFAULT_TOKEN) {
      localStorage.removeItem('admin_token')
      setToken('')
    }
  }, [])

  if (!token) return (
    <>
      <Toast toasts={toasts} remove={remove} />
      <LoginPage onLogin={handleLogin} />
    </>
  )

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'cart', label: 'Create Order', icon: '🛒' },
  ]

  return (
    <div className="min-h-screen bg-[#0d1117] flex">
      <Toast toasts={toasts} remove={remove} />

      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <aside className={`fixed top-0 left-0 h-full w-60 bg-[#0a0e18] border-r border-white/6 z-50 flex flex-col transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
          {/* Logo */}
          <div className="p-5 border-b border-white/6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-900 font-black text-sm">⚡</div>
              <span className="text-white font-black tracking-tight">VoltMart</span>
              <span className="text-xs text-amber-400 font-semibold ml-auto">ADMIN</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1">
            {nav.map(n => (
              <button key={n.id} onClick={() => { setTab(n.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                  ${tab === n.id ? 'bg-amber-400/15 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <span>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-sm font-bold">A</div>
              <div className="min-w-0">
                <p className="text-white text-xs font-medium truncate">{admin?.name || 'Admin'}</p>
                <p className="text-slate-500 text-xs truncate">{admin?.email || 'admin@voltmart.com'}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="w-full py-2 text-xs text-slate-400 hover:text-red-400 border border-white/10 rounded-xl transition hover:border-red-500/30">
              Sign Out
            </button>
          </div>
        </aside>
      </>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-white/6 flex items-center justify-between px-4 lg:px-6 sticky top-0 bg-[#0d1117]/95 backdrop-blur z-30">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition">
            ☰
          </button>
          <h1 className="text-white font-bold capitalize">{nav.find(n => n.id === tab)?.label || ''}</h1>
          <a href="/" target="_blank"
            className="text-xs text-slate-400 hover:text-amber-400 transition border border-white/10 px-3 py-1.5 rounded-xl">
            View Store ↗
          </a>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {tab === 'dashboard' && <DashboardPanel token={token} toast={toast} onNav={setTab} />}
          {tab === 'products' && <ProductsPanel token={token} toast={toast} />}
          {tab === 'orders' && <OrdersPanel token={token} toast={toast} />}
          {tab === 'cart' && <CartPanel token={token} toast={toast} />}
        </main>
      </div>
    </div>
  )
}
