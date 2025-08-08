import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
  constructor(errors: ValidationError[]) {
    super(
      {
        message: 'Validation failed',
        errors: ValidationException.formatErrors(errors),
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  private static formatErrors(errors: ValidationError[]) {
    return errors.map((error) => {
      const constraints = error.constraints
        ? Object.values(error.constraints)
        : [];

      return {
        [error.property]: constraints.join(', '),
      };
    });
  }
}
