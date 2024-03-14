import path from 'path'
import { app } from 'electron'
import { getMain } from '../libs/db'

const dbPath = path.join(app.getPath('userData'), 'wf.db')
const db = getMain(dbPath)
export function up(next: () => void): void {
  db.exec(`
    CREATE TABLE workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nodeId INTEGER,
      coordinatorStatus TEXT CHECK( coordinatorStatus IN ('pending_initialized','pending_queued','active_ongoing','active_exiting','active_slashed','exited_unslashed','exited_slashed','withdrawal_possible','withdrawal_done') ) NOT NULL DEFAULT 'pending_initialized',
      coordinatorPublicKey TEXT NOT NULL,
      coordinatorBalanceAmount INTEGER NOT NULL DEFAULT 0,
      coordinatorActivationEpoch INTEGER NOT NULL DEFAULT 0,
      coordinatorDeActivationEpoch INTEGER NOT NULL DEFAULT 0,
      coordinatorBlockCreationCount INTEGER NOT NULL DEFAULT 0,
      coordinatorAttestationCreationCount INTEGER NOT NULL DEFAULT 0,
      validatorStatus TEXT CHECK( coordinatorStatus IN ('pending_initialized','pending_activation','active','exited') ) NOT NULL DEFAULT 'pending_initialized',
      validatorAddress TEXT NOT NULL,
      validatorBalanceAmount INTEGER NOT NULL DEFAULT 0,
      validatorActivationEra INTEGER NOT NULL DEFAULT 0,
      validatorDeActivationEra INTEGER NOT NULL DEFAULT 0,
      validatorBlockCreationCount INTEGER NOT NULL DEFAULT 0,
      withdrawalAddress TEXT NOT NULL,
      signature TEXT NOT NULL,
      stakeAmount INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
      updatedAt DATETIME NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
      CONSTRAINT fkNode FOREIGN KEY (nodeId) REFERENCES nodes(id) ON DELETE SET NULL ON UPDATE CASCADE
    );
    CREATE TRIGGER update_workers_trigger
    AFTER UPDATE ON workers
    BEGIN
      UPDATE workers SET updatedAt = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = NEW.id;
    END;
  `)
  next()
}
export function down(next: () => void): void {
  db.exec(`
    DROP TABLE workers;
  `)
  next()
}
