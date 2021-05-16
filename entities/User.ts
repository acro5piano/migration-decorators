import { Column, Table, toSqlList } from '../src/ActiveMigration'

const UserStatus = ['online', 'away', 'offline']
type IUserStatus = keyof typeof UserStatus

@Table('users')
export class User {
  @Column(`BIGSERIAL PRIMARY KEY`)
  id!: string

  @Column(`STRING NOT NULL DEFAULT ''`)
  name!: string

  @Column(`BOOLEAN NOT NULL DEFAULT FALSE`)
  isDeleted!: string

  @Column(`STRING NOT NULL DEFAULT 'online' CHECK (status in ${toSqlList(UserStatus)})`) // prettier-ignore
  status!: IUserStatus
}
