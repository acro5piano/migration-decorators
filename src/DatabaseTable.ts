import { isNotNullable, getDefault } from './helpers'

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
    const toBeDeletedColumns = oldTable.columns
      .filter((oldColumn) => {
        return (
          this.columns.find(
            (column) => oldColumn.columnName === column.columnName,
          ) === undefined
        )
      })
      .map((oldColumn) => {
        return this.toDropColumnSql(oldColumn)
      })
    const newOrAlteredColumns = this.columns
      .map((column) => {
        const oldColumn = oldTable.columns.find(
          (c) => c.columnName === column.columnName,
        )
        if (oldColumn) {
          if (oldColumn.expr === column.expr) {
            return null
          }
          const defaultValue = getDefault(column.expr)
          if (defaultValue && getDefault(oldColumn.expr) !== defaultValue) {
            return this.toAlterColumnDefaultSql(column, defaultValue)
          }
          if (isNotNullable(oldColumn.expr) && !isNotNullable(column.expr)) {
            return this.toAlterColumnNotNullableSql(column)
          }
          if (!isNotNullable(oldColumn.expr) && isNotNullable(column.expr)) {
            return this.toAlterColumnNullableSql(column)
          }
          if (oldColumn.expr !== column.expr) {
            return this.toAlterColumnSql(column)
          }
          return null
        }
        return this.toAddColumnSql(column)
      })
      .filter(Boolean)
    return [...toBeDeletedColumns, ...newOrAlteredColumns].join(';\n')
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
    return `ALTER TABLE ${this.tableName} ALTER COLUMN ${column.columnName} TYPE ${column.expr}`
  }

  toAlterColumnNotNullableSql(column: Column) {
    return `ALTER TABLE ${this.tableName} ALTER COLUMN ${column.columnName} NOT NULL`
  }

  toAlterColumnNullableSql(column: Column) {
    return `ALTER TABLE ${this.tableName} ALTER COLUMN ${column.columnName} DROP NOT NULL`
  }

  toAlterColumnDefaultSql(column: Column, defaultValue: string) {
    return `ALTER TABLE ${this.tableName} ALTER COLUMN ${column.columnName} SET DEFAULT ${defaultValue}`
  }

  toDropColumnSql(column: Column) {
    return `ALTER TABLE ${this.tableName} DROP COLUMN ${column.columnName}`
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
