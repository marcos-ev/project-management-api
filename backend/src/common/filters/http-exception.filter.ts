import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = this.resolveStatusCode(exception);
    const { message, error } = this.resolveMessageAndError(
      exception,
      statusCode,
    );

    const body: ErrorResponseBody = {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(body);
  }

  private resolveStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveMessageAndError(
    exception: unknown,
    statusCode: number,
  ): { message: string | string[]; error: string } {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return { message: exceptionResponse, error: exception.name };
      }

      const { message, error } = exceptionResponse as {
        message?: string | string[];
        error?: string;
      };

      return {
        message: message ?? exception.message,
        error: error ?? exception.name,
      };
    }

    return {
      message: 'Erro interno no servidor',
      error: HttpStatus[statusCode] ?? 'InternalServerError',
    };
  }
}
