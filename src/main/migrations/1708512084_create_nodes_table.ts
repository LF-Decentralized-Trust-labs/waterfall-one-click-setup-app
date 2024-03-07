import path from 'path'
import { app } from 'electron'
import { getMain } from '../libs/db'

const dbPath = path.join(app.getPath('userData'), 'wf.db')
const db = getMain(dbPath)
export function up(next: () => void): void {
  db.exec(`
    CREATE TABLE nodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      network TEXT CHECK( network IN ('testnet8','mainnet') ) NOT NULL DEFAULT 'mainnet',
      type TEXT CHECK( type IN ('local','remote') ) NOT NULL DEFAULT 'local',
      locationDir TEXT NOT NULL,
      coordinatorStatus TEXT CHECK( coordinatorStatus IN ('stopped','running','syncing') ) NOT NULL DEFAULT 'stopped',
      coordinatorPeersCount INTEGER NOT NULL DEFAULT 0,
      coordinatorHeadSlot INTEGER NOT NULL DEFAULT 0,
      coordinatorSyncDistance INTEGER NOT NULL DEFAULT 0,
      coordinatorPreviousJustifiedEpoch INTEGER NOT NULL DEFAULT 0,
      coordinatorCurrentJustifiedEpoch INTEGER NOT NULL DEFAULT 0,
      coordinatorFinalizedEpoch INTEGER NOT NULL DEFAULT 0,
      coordinatorHttpApiPort INTEGER NOT NULL,
      coordinatorHttpValidatorApiPort INTEGER NOT NULL,
      coordinatorP2PTcpPort INTEGER NOT NULL,
      coordinatorP2PUdpPort INTEGER NOT NULL,
      coordinatorPid INTEGER,
      coordinatorValidatorStatus TEXT CHECK( coordinatorValidatorStatus IN ('stopped','running') ) NOT NULL DEFAULT 'stopped',
      coordinatorValidatorPid INTEGER,
      validatorStatus TEXT CHECK( validatorStatus IN ('stopped','running','syncing') ) NOT NULL DEFAULT 'stopped',
      validatorPeersCount INTEGER NOT NULL DEFAULT 0,
      validatorHeadSlot INTEGER NOT NULL DEFAULT 0,
      validatorSyncDistance INTEGER NOT NULL DEFAULT 0,
      validatorFinalizedSlot INTEGER NOT NULL DEFAULT 0,
      validatorP2PPort INTEGER NOT NULL,
      validatorHttpApiPort INTEGER NOT NULL,
      validatorWsApiPort INTEGER NOT NULL,
      validatorPid INTEGER,
      workersCount INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
      updatedAt DATETIME NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'))
    );
    CREATE TRIGGER update_nodes_trigger
    AFTER UPDATE ON nodes
    BEGIN
      UPDATE nodes SET updatedAt = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = NEW.id;
    END;
  `)
  next()
}
export function down(next: () => void): void {
  db.exec(`
    DROP TABLE nodes;
  `)
  next()
}
