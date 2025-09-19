import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    const stmt = db.prepare(`
      UPDATE clients SET
        name = ?, clarityId = ?, outreachWorker = ?,
        phase1Id = ?, phase2SocialSecurity = ?, phase3BirthCert = ?, phase4ProofOfIncome = ?,
        housingPaperworkCompleted = ?, housed = ?,
        hasBankAccount = ?, hasSavings = ?, hasChime = ?,
        needsDetox = ?, detoxReferralMadeTo = ?,
        needsMentalHealth = ?, mentalHealthReferralMadeTo = ?,
        notes = ?, updatedAt = datetime('now')
      WHERE id = ?
    `)

    await stmt.run(
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
      data.notes || null,
      params.id
    )

    const client = await db.prepare('SELECT * FROM clients WHERE id = ?').get(params.id)
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
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const stmt = db.prepare('DELETE FROM clients WHERE id = ?')
    await stmt.run(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}