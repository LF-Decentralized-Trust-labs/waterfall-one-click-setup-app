import Database from 'better-sqlite3'
import { FileStore, MigrationSet, FileStoreLoadCallback, Migration } from 'migrate'
import log from 'electron-log/main'
import { db } from './db'

type Database = ReturnType<typeof Database>
type Callback = (result: Error | null) => void
type migration = Pick<Migration, 'title' | 'description' | 'timestamp'>

export class SQLiteStore implements FileStore {
  private db: Database

  constructor() {
    this.db = db
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        timestamp INTEGER
      )
    `)
  }

  load(cb: FileStoreLoadCallback): void {
    try {
      const migrations = this.db
        .prepare('SELECT * FROM migrations ORDER BY id ASC')
        .all() as migration[]
      if (migrations.length === 0) {
        return cb(null, { migrations })
      }

      const state = {
        lastRun: migrations[migrations.length - 1].title,
        migrations
      }
      state.migrations.forEach((m) => log.debug('load-migration', m.title))

      cb(null, state)
    } catch (err) {
      cb(err as Error)
    }
  }

  save(set: MigrationSet, cb: Callback): void {
    try {
      if (!set.lastRun) return cb(null)
      const migration = set.map[set.lastRun]
      const insert = this.db.prepare('INSERT INTO migrations (title, timestamp) VALUES (?, ?)')
      insert.run(migration.title, migration.timestamp)
      log.debug('save-migration', migration.title)
      cb(null)
    } catch (err) {
      cb(err as Error)
    }
  }
}
