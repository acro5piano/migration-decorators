import { getSchema } from './schema'
import { MigrationGenerator } from './MigrationGenerator'
import { resolve } from 'path'

export async function main(args: string[]) {
  for (const file of args) {
    await import(resolve(file))
  }

  const schema = getSchema()
  console.log(schema.getCurrentTable().toCreateTableSql())

  const generator = new MigrationGenerator(schema)

  await generator.generate()
}
