export function toSqlList(arr: string[]) {
  return `(${arr.map((a) => `'${a}'`).join(', ')})`
}
