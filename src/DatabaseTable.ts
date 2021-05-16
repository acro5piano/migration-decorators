export interface DatabaseTableJson {
  tableName: string
  columns: string[]
}

export class DatabaseTable {
  columns: string[] = []

  constructor(private tableName: string) {}

  addColumn(columnName: string, expr: string) {
    this.columns.push(`${columnName} ${expr}`)
  }

  toCreateTableSql() {
    return `
      CREATE TABLE ${this.tableName} (
        ${this.columns.map((c) => `${c}`).join(',\n        ')}
      )
    `
  }

  toJson(): DatabaseTableJson {
    return {
      tableName: this.tableName,
      columns: this.columns,
    }
  }

  static fromJson(json: DatabaseTableJson) {
    const table = new DatabaseTable(json.tableName)
    table.columns = json.columns
    return table
  }
}
