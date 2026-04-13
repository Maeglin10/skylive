import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
const { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } = Prisma as any;
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { KnownError } from '../errors/known-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, body } = this.handleException(exception);

    if (!(exception instanceof KnownError) || status >= 500) {
      this.logger.error({
        message: 'Exception caught',
        error: exception instanceof Error ? exception.message : 'Unknown error',
        stack: exception instanceof Error ? exception.stack : undefined,
        path: request.url,
        method: request.method,
        statusCode: status,
      });

      if (process.env.SENTRY_DSN) {
        Sentry.withScope((scope) => {
          scope.setTag('path', request.url);
          scope.setTag('method', request.method);
          scope.setTag('status', String(status));
          if ((request as any).id) {
            scope.setExtra('requestId', (request as any).id);
          }
          scope.setExtra('ip', request.ip);
          scope.setExtra('userAgent', request.headers['user-agent']);
          Sentry.captureException(exception);
        });
      }
    }

    response.status(status).json({
      ...body,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...((request as any).id && { requestId: (request as any).id }),
    });
  }

  private handleException(exception: unknown): {
    status: number;
    body: Record<string, unknown>;
  } {
    if (exception instanceof KnownError) {
      return { status: exception.statusCode, body: exception.toJSON() };
    }

    if (this.isPrismaError(exception)) {
      return this.handlePrismaError(exception as Error);
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      return {
        status,
        body: {
          code: this.getErrorCodeFromStatus(status),
          error: typeof response === 'string' ? response : (response as any).message,
          ...(process.env.NODE_ENV !== 'production' && typeof response === 'object'
            ? { details: response }
            : {}),
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        code: 'INTERNAL_SERVER_ERROR',
        error:
          process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : exception instanceof Error
              ? exception.message
              : 'Unknown error',
      },
    };
  }

  private isPrismaError(exception: unknown): boolean {
    return (
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientUnknownRequestError ||
      exception instanceof PrismaClientValidationError
    );
  }

  private handlePrismaError(error: Error): {
    status: number;
    body: Record<string, unknown>;
  } {
    if (error instanceof PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          code: 'VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'production' ? 'Invalid query' : error.message,
        },
      };
    }

    if (error instanceof PrismaClientUnknownRequestError) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          code: 'DATABASE_UNKNOWN_ERROR',
          error: process.env.NODE_ENV === 'production' ? 'Database error' : error.message,
        },
      };
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return {
        status: HttpStatus.CONFLICT,
        body: {
          code: 'DATABASE_CONSTRAINT_ERROR',
          error: process.env.NODE_ENV === 'production' ? 'Database constraint error' : error.message,
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        code: 'DATABASE_ERROR',
        error: process.env.NODE_ENV === 'production' ? 'Database error' : error.message,
      },
    };
  }

  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      default:
        return 'HTTP_ERROR';
    }
  }
}
