import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await db.prepare(`
      SELECT fileData, fileName, fileType
      FROM documents
      WHERE id = ?
    `).get(params.id) as any

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    const response = new NextResponse(document.fileData)
    response.headers.set('Content-Type', document.fileType || 'application/octet-stream')
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${document.fileName}"`
    )

    return response
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stmt = db.prepare('DELETE FROM documents WHERE id = ?')
    const result = await stmt.run(params.id)

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}