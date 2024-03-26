import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from "@nestjs/common";

//@Catch()
//export class ExceptionFilter<T> implements ExceptionFilter {
//  catch(exception: T, host: ArgumentsHost) {}
//}

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof BadRequestException) {
      const response = host.switchToHttp().getResponse();

      response.status(exception.getStatus()).json({
        code: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception["response"]["message"],
        error: exception["response"]["error"],
      });
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        code: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
