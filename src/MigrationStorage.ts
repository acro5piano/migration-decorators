import { UmzugStorage, MigrationParams } from 'umzug'
import { Client } from 'pg'

interface Options {
  tableName: string
}

export class MigrationStorage implements UmzugStorage<Client> {
  constructor(protected options: Options) {}

  async executed({
    context: pg,
  }: Pick<MigrationParams<Client>, 'context'>): Promise<string[]> {
    const migrations = await pg.query<{ name: string }>(
      `SELECT name FROM ${this.options.tableName}`,
    )
    return migrations.rows.map((row) => row.name)
  }

  async logMigration({ name, context: pg }: MigrationParams<Client>) {
    await pg.query(
      `INSERT INTO ${this.options.tableName} (name) VALUES (${name})`,
    )
  }

  async unlogMigration({ name, context: pg }: MigrationParams<Client>) {
    await pg.query(`DELETE FROM ${this.options.tableName} WHERE name = ${name}`)
  }
  //
  // async ensureTable() {
  //   await this.pg.query(`
  //     CREATE TABLE IF NOT EXISTS ${this.options.tableName} (
  //       name STRING(255) NOT NULL,
  //       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  //     )
  //   `)
  // }
}
