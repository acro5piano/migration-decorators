import { Client } from 'pg'

export async function up({ context: pg }: { context: Client }) {
  await pg.query(`ALTER TABLE users ALTER COLUMN birth_date TYPE TIMESTAMPTZ`)
}
        