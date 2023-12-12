import { Permission } from 'src/core/enums/permission.enum'

export interface Payload {
  sub: string
  permissions: Record<string, Permission>
}
