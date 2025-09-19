import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'data.db')
const db = new Database(dbPath)

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    clarityId TEXT UNIQUE,
    outreachWorker TEXT,
    dateOfEntry TEXT NOT NULL DEFAULT (datetime('now')),
    phase1Id INTEGER DEFAULT 0,
    phase2SocialSecurity INTEGER DEFAULT 0,
    phase3BirthCert INTEGER DEFAULT 0,
    phase4ProofOfIncome INTEGER DEFAULT 0,
    housingPaperworkCompleted INTEGER DEFAULT 0,
    housed INTEGER DEFAULT 0,
    housingDate TEXT,
    hasBankAccount INTEGER DEFAULT 0,
    hasSavings INTEGER DEFAULT 0,
    hasChime INTEGER DEFAULT 0,
    needsDetox INTEGER DEFAULT 0,
    detoxReferralMadeTo TEXT,
    needsMentalHealth INTEGER DEFAULT 0,
    mentalHealthReferralMadeTo TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    clientId TEXT NOT NULL,
    fileName TEXT NOT NULL,
    fileType TEXT NOT NULL,
    fileSize INTEGER NOT NULL,
    fileData BLOB NOT NULL,
    uploadedBy TEXT,
    uploadedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
  )
`)

export { db }