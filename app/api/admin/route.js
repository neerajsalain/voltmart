import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

// ─── Admin credentials (env or defaults) ────────────────────────────────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@voltmart.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'voltmart-admin-secret-token'

function authError() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function verifyToken(request) {
  const auth = request.headers.get('authorization') || ''
  return auth === `Bearer ${ADMIN_TOKEN}`
}

// ─── CORS preflight ──────────────────────────────────────────────────────────
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })
}

// ─── GET ─────────────────────────────────────────────────────────────────────
export async function GET(request) {
  if (!verifyToken(request)) return authError()
  const { searchParams } = new URL(request.url)
  const resource = searchParams.get('resource')

  try {
    const db = await getDb()

    if (resource === 'products') {
      const products = await db.collection('products').find({}).sort({ createdAt: -1 }).toArray()
      return NextResponse.json(products.map(({ _id, ...r }) => r))
    }

    if (resource === 'orders') {
      const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray()
      return NextResponse.json(orders.map(({ _id, ...r }) => r))
    }

    if (resource === 'stats') {
      const [productCount, orderCount, orders] = await Promise.all([
        db.collection('products').countDocuments(),
        db.collection('orders').countDocuments(),
        db.collection('orders').find({}).toArray(),
      ])
      const revenue = orders.reduce((s, o) => s + (o.total || 0), 0)
      const lowStock = await db.collection('products').countDocuments({ stock: { $lt: 10 } })
      return NextResponse.json({ productCount, orderCount, revenue, lowStock })
    }

    return NextResponse.json({ error: 'Unknown resource' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ─── POST ────────────────────────────────────────────────────────────────────
export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  // Login — no token required
  if (action === 'login') {
    try {
      const { email, password } = await request.json()
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return NextResponse.json({ token: ADMIN_TOKEN, admin: { email: ADMIN_EMAIL, name: 'Admin' } })
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    } catch {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 })
    }
  }

  if (!verifyToken(request)) return authError()

  try {
    const db = await getDb()

    // Add product
    if (action === 'add-product') {
      const body = await request.json()
      const { name, brand, category, price, mrp, stock, description, features, tags, image } = body
      if (!name || !price || !category) {
        return NextResponse.json({ error: 'Name, price and category are required' }, { status: 400 })
      }
      const product = {
        id: uuidv4(),
        name: name.trim(),
        brand: (brand || '').trim(),
        category: category.trim(),
        price: Number(price),
        mrp: Number(mrp || price),
        stock: Number(stock || 0),
        description: (description || '').trim(),
        features: Array.isArray(features) ? features : [],
        tags: Array.isArray(tags) ? tags : [],
        image: image || '/products/placeholder.webp',
        rating: 0,
        reviews: 0,
        createdAt: new Date().toISOString(),
      }
      await db.collection('products').insertOne({ ...product })
      return NextResponse.json(product, { status: 201 })
    }

    // Update order status
    if (action === 'update-order') {
      const { id, status } = await request.json()
      if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })
      await db.collection('orders').updateOne({ id }, { $set: { status } })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ─── PUT ─────────────────────────────────────────────────────────────────────
export async function PUT(request) {
  if (!verifyToken(request)) return authError()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Product id required' }, { status: 400 })

  try {
    const db = await getDb()
    const body = await request.json()
    const update = {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.brand !== undefined && { brand: body.brand.trim() }),
      ...(body.category !== undefined && { category: body.category.trim() }),
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.mrp !== undefined && { mrp: Number(body.mrp) }),
      ...(body.stock !== undefined && { stock: Number(body.stock) }),
      ...(body.description !== undefined && { description: body.description.trim() }),
      ...(body.features !== undefined && { features: body.features }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.image !== undefined && { image: body.image }),
      updatedAt: new Date().toISOString(),
    }
    const result = await db.collection('products').updateOne({ id }, { $set: update })
    if (result.matchedCount === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ success: true, id, ...update })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
export async function DELETE(request) {
  if (!verifyToken(request)) return authError()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const resource = searchParams.get('resource') || 'product'
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    const db = await getDb()
    if (resource === 'order') {
      await db.collection('orders').deleteOne({ id })
    } else {
      await db.collection('products').deleteOne({ id })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
