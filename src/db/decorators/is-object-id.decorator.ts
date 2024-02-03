import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { registerDecorator, ValidationOptions } from 'class-validator'
import { ObjectId } from 'mongodb'

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return ObjectId.isValid(value)
        },
        defaultMessage() {
          return `$property must be a valid ObjectId`
        },
      },
    })
  }
}

const toObjectId = (value: string) => {
  return ObjectId.isValid(value) ? new ObjectId(value) : undefined
}

export function ToObjectId() {
  return applyDecorators(
    ApiProperty({
      type: String,
    }),
    Transform(({ value }) => toObjectId(value))
  )
}
