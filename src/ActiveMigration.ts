import { snakeCase } from 'snake-case'

class DatabaseSchema {
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
}

class DatabaseTable {
  columns: string[] = []

  constructor(private tableName: string) {}

  addColumn(columnName: string, expr: string) {
    this.columns.push(`${columnName} ${expr}`)
  }

  toCreateTableSql() {
    return `
      CREATE TABLE ${this.tableName} (
        ${this.columns.join(',\n')}
      )
    `
  }
}

const schema = new DatabaseSchema()

export function Table(tableName: string) {
  schema.addTable(tableName)
  schema.flushThunk()
  return function (_constructor: Function) {}
}

export function Column(expr: string) {
  return function (_target: any, propertyKey: string) {
    schema.addThunk(() => {
      schema.getCurrentTable().addColumn(snakeCase(propertyKey), expr)
    })
  }
}

export function toSqlList(arr: string[]) {
  return `(${arr.map((a) => `'${a}'`).join(', ')})`
}

export function getSchema() {
  return schema
}
