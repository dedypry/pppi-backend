import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let res: any = null;
    if (exception instanceof HttpException) {
      res = exception.getResponse();
    }

    if (!res) {
      res = {
        message: 'Internal Server Error',
      };
    }

    response.status(status).json({
      message: res?.message,
      errors: res?.errors,
    });
  }
}
