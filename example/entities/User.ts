import { Column, Table, toSqlList } from '../../src'

const UserStatus = ['online', 'away', 'offline']
type IUserStatus = keyof typeof UserStatus

@Table('users')
export class User {
  @Column(`BIGSERIAL PRIMARY KEY`)
  id!: string

  @Column(`VARCHAR(255) NOT NULL DEFAULT ''`)
  name!: string

  @Column(`BOOLEAN NOT NULL DEFAULT FALSE`)
  isDeleted!: string

  @Column(`VARCHAR(50) NOT NULL DEFAULT 'online' CHECK (status in ${toSqlList(UserStatus)})`) // prettier-ignore
  status!: IUserStatus

  @Column(`TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`) // prettier-ignore
  birthDate!: Date
}
