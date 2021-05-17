export function toSqlList(arr: string[]) {
  return `(${arr.map((a) => `'${a}'`).join(', ')})`
}

export function isNotNullable(expr: string) {
  return !/NOT NULL/i.test(expr)
}

export function getDefault(expr: string) {
  const matches = expr.match(/DEFAULT (.+)/i)
  return matches?.[1]
}
