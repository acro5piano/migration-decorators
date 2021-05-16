import { DatabaseTable, DatabaseTableJson } from './DatabaseTable'

export class DatabaseSchema {
  tables: DatabaseTable[] = []
  thunks: Function[] = []

  addTable(tableName: string) {
    this.tables.push(new DatabaseTable(tableName))
  }

  getCurrentTable() {
    const table = this.tables.slice(-1)[0]
    if (!table) {
      throw new Error('no table defined.')
    }
    return table
  }

  addThunk(thunk: Function) {
    this.thunks.push(thunk)
  }

  flushThunk() {
    this.thunks.forEach((thunk) => thunk())
    this.thunks = []
  }

  toJson(): DatabaseTableJson[] {
    return this.tables.map((table) => table.toJson())
  }

  static fromJson(json: DatabaseTableJson[]) {
    const schema = new DatabaseSchema()
    schema.tables = json.map((j) => DatabaseTable.fromJson(j))
    return schema
  }
}
