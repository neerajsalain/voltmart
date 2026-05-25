import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'voltmart-admin-secret-token'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function POST(request) {
  const auth = request.headers.get('authorization') || ''
  if (auth !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPG, PNG, WEBP or GIF.' }, { status: 400 })
    }

    // Max 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop().toLowerCase() || 'jpg'
    const filename = `${uuidv4()}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
