import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const query = request.query;

    return next.handle().pipe(
      map((data) => {
        if (data?.results && data?.total) {
          const page = query?.page || 0;
          const pageSize = query?.pageSize || 10;

          const perPage = +pageSize || 10;
          const currentPage = page ? +page : 1;
          const lastPage = Math.ceil(data.total / perPage);

          return {
            data: data?.results,
            total: data?.total,
            current_page: currentPage,
            per_page: perPage,
            last_page: lastPage,
          };
        }

        if (Array.isArray(data) || typeof data == 'object') {
          return data;
        }

        return {
          message: data,
        };
      }),
    );
  }
}
