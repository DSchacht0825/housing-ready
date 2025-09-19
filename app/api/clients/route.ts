import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const clients = await db.prepare('SELECT * FROM clients ORDER BY createdAt DESC').all()
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const id = Math.random().toString(36).substring(2) + Date.now().toString(36)

    const stmt = db.prepare(`
      INSERT INTO clients (
        id, name, clarityId, outreachWorker,
        phase1Id, phase2SocialSecurity, phase3BirthCert, phase4ProofOfIncome,
        housingPaperworkCompleted, housed,
        hasBankAccount, hasSavings, hasChime,
        needsDetox, detoxReferralMadeTo,
        needsMentalHealth, mentalHealthReferralMadeTo,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    await stmt.run(
      id,
      data.name,
      data.clarityId || null,
      data.outreachWorker || null,
      data.phase1Id ? 1 : 0,
      data.phase2SocialSecurity ? 1 : 0,
      data.phase3BirthCert ? 1 : 0,
      data.phase4ProofOfIncome ? 1 : 0,
      data.housingPaperworkCompleted ? 1 : 0,
      data.housed ? 1 : 0,
      data.hasBankAccount ? 1 : 0,
      data.hasSavings ? 1 : 0,
      data.hasChime ? 1 : 0,
      data.needsDetox ? 1 : 0,
      data.detoxReferralMadeTo || null,
      data.needsMentalHealth ? 1 : 0,
      data.mentalHealthReferralMadeTo || null,
      data.notes || null
    )

    const client = await db.prepare('SELECT * FROM clients WHERE id = ?').get(id)
    return NextResponse.json(client)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}