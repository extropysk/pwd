import { Permission } from 'src/core/enums/permission.enum'
import { Payload } from 'src/core/interfaces/payload.interface'

export class PayloadDto implements Payload {
  permissions: Record<string, Permission>
  sub: string
}
