import { getSchema } from './schema'
import { MigrationGenerator } from './MigrationGenerator'
import { MigrationStorage } from './MigrationStorage'
import { Umzug } from 'umzug'
import { resolve } from 'path'
import { Client } from 'pg'

export async function main(args: string[]) {
  switch (args[0]) {
    case 'migrate':
      await migrate()
      return
    case 'generate':
      await generate(args.slice(1))
      return
  }
}

async function generate(files: string[]) {
  for (const file of files) {
    await import(resolve(file))
  }

  const schema = getSchema()

  const generator = new MigrationGenerator(schema)

  await generator.generate()
}

async function migrate() {
  const pg = new Client({
    connectionString: 'postgres://postgres:postgres@127.0.0.1:11000/postgres',
  })
  const storage = new MigrationStorage({
    tableName: 'migration_decorators',
  })
  const umzug = new Umzug({
    migrations: {
      glob: 'migrations/*.{ts}',
    },
    context: pg,
    logger: console,
    storage,
  })
  await umzug.up()
}
