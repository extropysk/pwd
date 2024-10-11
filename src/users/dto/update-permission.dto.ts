import { IsNumber, IsString, Min } from 'class-validator'

export class UpdatePermissionDto {
  @IsString()
  subject: string

  @IsNumber()
  @Min(0)
  action: number
}
