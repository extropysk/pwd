import { Actions } from 'src/core/enums/actions.enum'
import { Payload, Permission } from 'src/core/interfaces/payload.interface'

export class PermissionDto implements Permission {
  subject: string
  action: Actions
}

export class PayloadDto implements Payload {
  permissions: PermissionDto[]
  sub: string
}
