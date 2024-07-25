import path from 'path'
import { app } from 'electron'
import { getMain } from '../libs/db'

const dbPath = path.join(app.getPath('userData'), 'wf.db')
const db = getMain(dbPath)
export function up(next: () => void): void {
  db.exec(`
    BEGIN TRANSACTION;
    ALTER TABLE nodes ADD COLUMN downloadStatus TEXT NOT NULL DEFAULT 'finish';
    ALTER TABLE nodes ADD COLUMN downloadUrl TEXT DEFAULT NULL;
    ALTER TABLE nodes ADD COLUMN downloadHash TEXT DEFAULT NULL;
    ALTER TABLE nodes ADD COLUMN downloadSize INTEGER DEFAULT 0;
    ALTER TABLE nodes ADD COLUMN downloadBytes INTEGER DEFAULT 0;
    COMMIT;
  `)
  next()
}
export function down(next: () => void): void {
  next()
}
