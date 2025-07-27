import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Prisma exceptions
    if (exception?.code === 'P2002') {
      return response.status(400).json({
        error:true,
        statusCode: 400,
        path: request.url,
        message:
          'Unique constraint failed. A record with this value already exists.',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception?.code === 'P2003') {
      return response.status(400).json({
        error:true,
        statusCode: 400,
        path: request.url,
        message:
          'Foreign key constraint failed. Related record does not exist.',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception?.code === 'P2004') {
      return response.status(400).json({
        error:true,
        statusCode: 400,
        path: request.url,
        message: 'A constraint failed on the database.',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception?.code === 'P2025') {
      return response.status(404).json({
        error:true,
        statusCode: 404,
        path: request.url,
        message: 'Record not found.',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception?.code === 'P2010') {
      return response.status(400).json({
        error:true,
        statusCode: 400,
        path: request.url,
        message: 'Raw query failed. Please check your query syntax.',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception?.code === 'P2011') {
      return response.status(400).json({
        error:true,
        statusCode: 400,
        path: request.url,
        message: 'Null constraint violation. Required field is missing.',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception?.code === 'P2014') {
      return response.status(400).json({
        error:true,
        statusCode: 400,
        path: request.url,
        message: 'The change violates a relation constraint.',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception?.code === 'P2016') {
      return response.status(400).json({
        error:true,
        statusCode: 400,
        path: request.url,
        message: 'Query interpretation error. Possible invalid input.',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception?.code === 'P2022') {
      return response.status(500).json({
        error:true,
        statusCode: 500,
        path: request.url,
        message: 'Column not found in the database.',
        timestamp: new Date().toISOString(),
      });
    }

    response.status(status).json({
      error:true,
        statusCode: status,
      path: request.url,
      message: typeof message === 'string' ? message : (message as any).message,
      timestamp: new Date().toISOString(),
    });
  }
}
