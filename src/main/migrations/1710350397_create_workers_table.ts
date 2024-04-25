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
      number INTEGER NOT NULL DEFAULT 0,
      coordinatorStatus TEXT CHECK( coordinatorStatus IN ('pending_initialized','pending_queued','pending_activation','active_ongoing','active_exiting','active_slashed','exited_unslashed','exited_slashed','withdrawal_possible','withdrawal_done') ) NOT NULL DEFAULT 'pending_initialized',
      coordinatorPublicKey TEXT NOT NULL,
      coordinatorBalanceAmount TEXT NOT NULL DEFAULT '0',
      coordinatorActivationEpoch TEXT NOT NULL DEFAULT '',
      coordinatorDeActivationEpoch TEXT NOT NULL DEFAULT '',
      coordinatorBlockCreationCount INTEGER NOT NULL DEFAULT 0,
      coordinatorAttestationCreationCount INTEGER NOT NULL DEFAULT 0,
      validatorStatus TEXT CHECK( validatorStatus IN ('pending_initialized','pending_activation','active','pending_exiting','exited') ) NOT NULL DEFAULT 'pending_initialized',
      validatorAddress TEXT NOT NULL,
      validatorBalanceAmount TEXT NOT NULL DEFAULT '0',
      validatorActivationEpoch TEXT NOT NULL DEFAULT '',
      validatorDeActivationEpoch TEXT NOT NULL DEFAULT '',
      validatorBlockCreationCount INTEGER NOT NULL DEFAULT 0,
      withdrawalAddress TEXT NOT NULL,
      signature TEXT NOT NULL,
      stakeAmount TEXT NOT NULL DEFAULT '0',
      createdAt DATETIME NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
      updatedAt DATETIME NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
      CONSTRAINT fkNode FOREIGN KEY (nodeId) REFERENCES nodes(id) ON DELETE SET NULL ON UPDATE CASCADE
    );
    CREATE TRIGGER update_workers_trigger
    AFTER UPDATE ON workers
    BEGIN
      UPDATE workers SET updatedAt = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = NEW.id;
    END;
    CREATE TRIGGER update_workers_number_trigger
    AFTER INSERT ON workers
    BEGIN
      UPDATE workers SET number = (SELECT COUNT(*) FROM workers WHERE nodeId = NEW.nodeId) - 1 WHERE id = NEW.id;
      UPDATE nodes SET workersCount = workersCount + 1 WHERE id = NEW.nodeId;
    END;
  `)
  next()
}
export function down(next: () => void): void {
  db.exec(`
    DROP TRIGGER IF EXISTS update_workers_trigger;
    DROP TRIGGER IF EXISTS update_workers_number_trigger;
    DROP TABLE workers;
  `)
  next()
}
