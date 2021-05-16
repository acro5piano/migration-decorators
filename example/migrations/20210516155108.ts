import { Client } from 'pg'

export async function up({ context: pg }: { context: Client }) {
  await pg.query(`ALTER TABLE users ADD COLUMN birth_date TIMESTAMPTZ NOT NULL`)
}
        