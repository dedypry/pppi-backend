import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { UniqueViolationError } from 'objection';

@Catch(HttpException, UniqueViolationError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error(exception);

    if (exception instanceof UniqueViolationError) {
      return response.status(400).json({
        message: `${exception.columns
          .map((e) => e)
          .join(', ')
          .toUpperCase()} Sudah Terdaftar`,
        detail: exception.constraint,
      });
    }

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    // fallback untuk error lain
    return response.status(500).json({
      message: 'Internal Server Error',
    });
  }
}
