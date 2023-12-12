import { Permission } from 'src/core/enums/permission.enum'

export interface User {
  key: string
  permissions: Record<string, Permission>
}
