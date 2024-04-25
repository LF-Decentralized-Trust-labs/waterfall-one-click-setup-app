import path from 'path'
import { app } from 'electron'
import { getMain } from '../libs/db'

const dbPath = path.join(app.getPath('userData'), 'wf.db')
const db = getMain(dbPath)
export function up(next: () => void): void {
  db.exec(`
    DROP TRIGGER IF EXISTS update_workers_number_trigger;
    CREATE TRIGGER update_workers_number_trigger
    AFTER INSERT ON workers
    BEGIN
      UPDATE workers SET number = (SELECT workersCount FROM nodes WHERE id = NEW.nodeId) WHERE id = NEW.id;
      UPDATE nodes SET workersCount = workersCount + 1 WHERE id = NEW.nodeId;
    END;
  `)
  next()
}
export function down(next: () => void): void {
  db.exec(`
    DROP TRIGGER IF EXISTS update_workers_number_trigger;
  `)
  next()
}
