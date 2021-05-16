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
}
