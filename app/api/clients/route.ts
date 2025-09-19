import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const clients = await db.prepare('SELECT * FROM clients ORDER BY createdAt DESC').all()
    const transformedClients = clients.map((client: any) => ({
      ...client,
      phase1Id: Boolean(client.phase1Id),
      phase2SocialSecurity: Boolean(client.phase2SocialSecurity),
      phase3BirthCert: Boolean(client.phase3BirthCert),
      phase4ProofOfIncome: Boolean(client.phase4ProofOfIncome),
      housingPaperworkCompleted: Boolean(client.housingPaperworkCompleted),
      housed: Boolean(client.housed),
      hasBankAccount: Boolean(client.hasBankAccount),
      hasSavings: Boolean(client.hasSavings),
      hasChime: Boolean(client.hasChime),
      needsDetox: Boolean(client.needsDetox),
      needsMentalHealth: Boolean(client.needsMentalHealth)
    }))
    return NextResponse.json(transformedClients)
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
    const transformedClient = {
      ...client,
      phase1Id: Boolean((client as any).phase1Id),
      phase2SocialSecurity: Boolean((client as any).phase2SocialSecurity),
      phase3BirthCert: Boolean((client as any).phase3BirthCert),
      phase4ProofOfIncome: Boolean((client as any).phase4ProofOfIncome),
      housingPaperworkCompleted: Boolean((client as any).housingPaperworkCompleted),
      housed: Boolean((client as any).housed),
      hasBankAccount: Boolean((client as any).hasBankAccount),
      hasSavings: Boolean((client as any).hasSavings),
      hasChime: Boolean((client as any).hasChime),
      needsDetox: Boolean((client as any).needsDetox),
      needsMentalHealth: Boolean((client as any).needsMentalHealth)
    }
    return NextResponse.json(transformedClient)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}