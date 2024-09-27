/*
 * Copyright 2024   Blue Wave Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import * as migrate from 'migrate'
import log from 'electron-log/node'
import { SQLiteStore } from './SQLiteStore'

import * as create_nodes_table from '../migrations/1708512084_create_nodes_table'
import * as create_workers_table from '../migrations/1710350397_create_workers_table'
import * as update_workers_number_trigger from '../migrations/1714068668_update_workers_number_trigger'
import * as add_download_to_nodes_table from '../migrations/1714416355_add_download_to_nodes_table'
import * as add_delegate_to_workers_table from '../migrations/1722960792_add_delegate_to_workers_table'
import * as add_global_index_to_workers_table from '../migrations/1726762138_add_global_index_to_workers_table'

const migrations = {
  '1708512084_create_nodes_table': create_nodes_table,
  '1710350397_create_workers_table': create_workers_table,
  '1714068668_update_workers_number_trigger': update_workers_number_trigger,
  '1714416355_add_download_to_nodes_table': add_download_to_nodes_table,
  '1722960792_add_delegate_to_workers_table': add_delegate_to_workers_table,
  '1726762138_add_global_index_to_workers_table': add_global_index_to_workers_table
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
          log.error('Migration loading error:', err)
          return reject(err)
        }
        set.up((err) => {
          if (err) {
            log.error('Migration error:', err)
            return reject(err)
          }
          log.debug('Migrations successfully up')
          return resolve(true)
        })
      }
    )
  })
}
