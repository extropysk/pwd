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
