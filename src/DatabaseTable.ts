interface Column {
  columnName: string
  expr: string
}

export interface DatabaseTableJson {
  tableName: string
  columns: Column[]
}

export class DatabaseTable {
  columns: Column[] = []

  constructor(public tableName: string) {}

  addColumn(columnName: string, expr: string) {
    this.columns.push({ columnName, expr })
  }

  toSql(oldTable?: DatabaseTable) {
    if (!oldTable) {
      return this.toCreateTableSql()
    }
    return this.columns
      .map((column) => {
        const oldColumn = oldTable.columns.find(
          (c) => c.columnName === column.columnName,
        )
        if (oldColumn) {
          if (oldColumn.expr !== column.expr) {
            return this.toAlterColumnSql(column)
          }
          return null
        }
        return this.toAddColumnSql(column)
      })
      .filter(Boolean)
      .join(';\n')
  }

  toCreateTableSql() {
    return `
      CREATE TABLE ${this.tableName} (
        ${this.columns
          .map((c) => `${c.columnName} ${c.expr}`)
          .join(',\n        ')}
      )
    `
  }

  toAddColumnSql(column: Column) {
    return `ALTER TABLE ${this.tableName} ADD COLUMN ${column.columnName} ${column.expr}`
  }

  toAlterColumnSql(column: Column) {
    return `ALTER TABLE ${this.tableName} ALTER COLUMN ${column.columnName} ${column.expr}`
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
