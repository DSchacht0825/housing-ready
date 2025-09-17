import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // This will create the database and tables if they don't exist
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Client" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "clarityId" TEXT,
      "outreachWorker" TEXT,
      "dateOfEntry" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "phase1Id" BOOLEAN NOT NULL DEFAULT 0,
      "phase2SocialSecurity" BOOLEAN NOT NULL DEFAULT 0,
      "phase3BirthCert" BOOLEAN NOT NULL DEFAULT 0,
      "phase4ProofOfIncome" BOOLEAN NOT NULL DEFAULT 0,
      "housingPaperworkCompleted" BOOLEAN NOT NULL DEFAULT 0,
      "housed" BOOLEAN NOT NULL DEFAULT 0,
      "housingDate" DATETIME,
      "hasBankAccount" BOOLEAN NOT NULL DEFAULT 0,
      "hasSavings" BOOLEAN NOT NULL DEFAULT 0,
      "hasChime" BOOLEAN NOT NULL DEFAULT 0,
      "needsDetox" BOOLEAN NOT NULL DEFAULT 0,
      "detoxReferralMadeTo" TEXT,
      "needsMentalHealth" BOOLEAN NOT NULL DEFAULT 0,
      "mentalHealthReferralMadeTo" TEXT,
      "notes" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`

    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Client_clarityId_key" ON "Client"("clarityId")`

    return NextResponse.json({ message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({ error: 'Setup failed', details: error }, { status: 500 })
  }
}