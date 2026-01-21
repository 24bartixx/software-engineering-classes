import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

// Ensures repeat_password matches password
function Match(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName: propertyName.toString(),
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName.toString()} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}

export class VerifyAccountDto {
  @ApiProperty({
    description:
      'User password (at least 7 characters, 1 uppercase, 1 lowercase, 1 digit)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{7,})/, {
    message:
      'Password must contain at least 7 characters, one uppercase letter, one lowercase letter, and one digit',
  })
  password: string;

  @ApiProperty({ description: 'Password confirmation' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{7,})/, {
    message:
      'Password must contain at least 7 characters, one uppercase letter, one lowercase letter, and one digit',
  })
  @Match('password', { message: 'Passwords do not match' })
  repeat_password: string;
}
