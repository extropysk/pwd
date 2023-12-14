import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'

@ValidatorConstraint()
class RecordValidator implements ValidatorConstraintInterface {
  validate(obj: Record<string, unknown>, { constraints }: ValidationArguments) {
    if (typeof obj !== 'object' || obj === null) {
      return false
    }

    if (constraints) {
      return Object.values(obj).every((value) => constraints.includes(value))
    }

    return true
  }

  defaultMessage({ constraints }: ValidationArguments) {
    if (constraints) {
      return (
        '$property must be a value key pair object with values in ' +
        JSON.stringify(constraints).replace(/"/g, "'")
      )
    }

    return '$property must be a value key pair object'
  }
}

export function IsRecord(constraints?: any[], validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isRecord',
      target: object.constructor,
      propertyName: propertyName,
      constraints,
      options: validationOptions,
      validator: RecordValidator,
    })
  }
}
