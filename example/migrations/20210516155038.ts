import { Client } from 'pg'

export async function up({ context: pg }: { context: Client }) {
  await pg.query(`ALTER TABLE users DROP COLUMN birth_date`)
}
        