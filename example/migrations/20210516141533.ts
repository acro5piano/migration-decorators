import { Client } from 'pg'

export async function up({ context: pg }: { context: Client }) {
  await pg.query(`
      CREATE TABLE users (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL DEFAULT '',
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        status VARCHAR(50) NOT NULL DEFAULT 'online' CHECK (status in ('online', 'away', 'offline'))
      )
    `)
}
