import path from 'path'
import { app } from 'electron'
import { getMain } from '../libs/db'

const dbPath = path.join(app.getPath('userData'), 'wf.db')
const db = getMain(dbPath)
export function up(next: () => void): void {
  db.exec(`
    BEGIN TRANSACTION;
    ALTER TABLE workers ADD COLUMN delegate TEXT DEFAULT NULL;
    COMMIT;
  `)
  next()
}
export function down(next: () => void): void {
  next()
}
