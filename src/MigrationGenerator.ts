import { writeFile, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { DatabaseSchema } from './DatabaseSchema'

export class MigrationGenerator {
  constructor(private schema: DatabaseSchema) {}

  async generate() {
    // Thanks https://github.com/mikro-orm/mikro-orm/blob/9c37f6141d8723d6c472dfd3557a1d749d344455/packages/migrations/src/MigrationGenerator.ts#L14
    const timestamp = new Date().toISOString().replace(/[-T:]|\.\d{3}z$/gi, '')
    const dirPath = resolve(process.cwd(), `./migrations`)
    await mkdir(dirPath).catch((e) => {
      // Don't care
      if (e.code !== 'EEXIST') {
        throw e
      }
    })
    const filePath = resolve(dirPath, `${timestamp}.ts`)
    await writeFile(filePath, await this.getCode(), 'utf8')
  }

  async getCode() {
    return `import { Client } from 'pg'

export async function up({ context: pg }: { context: Client }) {
  await pg.query(\`${this.schema.getCurrentTable().toCreateTableSql()}\`)
}
        `
  }
}
