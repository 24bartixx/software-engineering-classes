import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    console.log(`Request [${req.method}] to: ${req.url}`);

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`Response sent in: ${Date.now() - now}ms`)));
  }
}
