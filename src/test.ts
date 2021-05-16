import { getSchema } from './ActiveMigration'
import { resolve } from 'path'

async function main(args: string[]) {
  for (const file of args) {
    await import(resolve(file))
  }

  const schema = getSchema()
  console.log(JSON.stringify(schema, undefined, 2))
  console.log(schema.getCurrentTable().toCreateTableSql())
}

main(process.argv.slice(2))
