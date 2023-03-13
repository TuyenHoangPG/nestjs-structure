import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';
import { RedirectingException } from '../interfaces/api-exception';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest();
    const res: Response = ctx.getResponse();

    if (error instanceof RedirectingException) {
      return res.redirect(error.url);
    }

    if (error instanceof TypeORMError) {
      error = new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const status = typeof error.getStatus === 'function' ? error.getStatus() : HttpStatus.BAD_REQUEST;

    return res.status(status).json({
      statusCode: status,
      error: error.response.name || error.name,
      message: error.response.message || error.message,
      errors: error.response.errors || null,
      timestamp: new Date().toISOString(),
      path: req ? req.url : null,
    });
  }
}
