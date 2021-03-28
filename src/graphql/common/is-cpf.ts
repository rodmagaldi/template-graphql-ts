import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import validator from 'validator';
import * as cpf from 'cpf';

export function IsCpf(property?: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && validator.isNumeric(value, { no_symbols: true }) && cpf.isValid(value);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          if (!validator.isNumeric(validationArguments.value, { no_symbols: true })) {
            return 'Formato do CPF inválido, utilize apenas os dígitos.';
          }
          return 'CPF inválido';
        },
      },
    });
  };
}
