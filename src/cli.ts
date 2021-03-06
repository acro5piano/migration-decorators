import { getSchema } from './schema'
import { MigrationGenerator } from './MigrationGenerator'
import { MigrationStorage } from './MigrationStorage'
import { DatabaseSchema } from './DatabaseSchema'
import { Umzug } from 'umzug'
import { resolve } from 'path'
import { writeFile, readFile } from 'fs/promises'
import { Client } from 'pg'

const DB_SCHEMA_FILE = resolve(process.cwd(), 'db-schema.json')

export async function main(args: string[]) {
  const [cmd, ...files] = args
  if (files) {
    for (const file of files) {
      await import(resolve(file))
    }
  }

  switch (cmd) {
    case 'generate-initial':
      await generateInitial()
      return
    case 'generate':
      await generate()
      return
    case 'migrate':
      await migrate()
      return
  }
}

async function generateInitial() {
  const schema = getSchema()
  const generator = new MigrationGenerator(schema)
  await generator.generate()
}

async function generate() {
  const schema = getSchema()
  const oldSchema = DatabaseSchema.fromJson(
    JSON.parse(await readFile(DB_SCHEMA_FILE, 'utf8')),
  )
  const generator = new MigrationGenerator(schema, oldSchema)
  await generator.generate()
}

async function migrate() {
  const pg = new Client({
    connectionString: 'postgres://postgres:postgres@127.0.0.1:11000/postgres',
  })
  await pg.connect()
  await pg.query(`BEGIN`)
  try {
    await pg.query(`
      CREATE TABLE IF NOT EXISTS migration_decorators (
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const storage = new MigrationStorage({
      tableName: 'migration_decorators',
    })
    const umzug = new Umzug({
      migrations: {
        glob: resolve(process.cwd(), 'migrations/*.ts'),
      },
      context: pg,
      logger: console,
      storage,
    })
    await umzug.up()

    const schema = getSchema()
    await writeFile(
      DB_SCHEMA_FILE,
      JSON.stringify(schema.toJson(), undefined, 2),
      'utf8',
    )
    await pg.query(`COMMIT`)
  } catch (e) {
    await pg.query(`ROLLBACK`)
    console.error(e.message)
  }

  await pg.end()
}
