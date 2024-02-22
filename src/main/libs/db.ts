import * as path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'

type Database = ReturnType<typeof Database>

const dbPath: string = path.join(app.getPath('userData'), 'wf.db')
export const db: Database = new Database(dbPath)
