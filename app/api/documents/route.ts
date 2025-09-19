import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string
    const uploadedBy = formData.get('uploadedBy') as string || 'System'

    if (!file || !clientId) {
      return NextResponse.json(
        { error: 'File and clientId are required' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const stmt = db.prepare(`
      INSERT INTO documents (id, clientId, fileName, fileType, fileSize, fileData, uploadedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      documentId,
      clientId,
      file.name,
      file.type,
      file.size,
      buffer,
      uploadedBy
    )

    return NextResponse.json({
      success: true,
      documentId,
      fileName: file.name
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json(
        { error: 'ClientId is required' },
        { status: 400 }
      )
    }

    const documents = db.prepare(`
      SELECT id, fileName, fileType, fileSize, uploadedBy, uploadedAt
      FROM documents
      WHERE clientId = ?
      ORDER BY uploadedAt DESC
    `).all(clientId)

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}