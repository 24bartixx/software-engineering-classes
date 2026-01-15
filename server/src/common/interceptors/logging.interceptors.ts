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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(`Zapytanie [${req.method}] do: ${req.url}`);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`Odpowiedź wysłana po: ${Date.now() - now}ms`)),
      );
  }
}
