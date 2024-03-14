import * as migrate from 'migrate'
import { SQLiteStore } from './SQLiteStore'

import * as create_nodes_table from '../migrations/1708512084_create_nodes_table'
import * as create_workers_table from '../migrations/1710350397_create_workers_table'

const migrations = {
  '1708512084_create_nodes_table': create_nodes_table,
  '1710350397_create_workers_table': create_workers_table
}
export function runMigrations(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    migrate.load(
      {
        stateStore: new SQLiteStore(),
        migrations
      },
      (err, set) => {
        if (err) {
          console.error('Migration loading error:', err)
          return reject(err)
        }
        set.up((err) => {
          if (err) {
            console.error('Migration error:', err)
            return reject(err)
          }
          console.log('Migrations successfully up')
          return resolve(true)
        })
      }
    )
  })
}
