import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest();
    const res: Response = ctx.getResponse();

    if (error.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
      if (typeof error.response !== 'string') {
        error.response['message'] = 'Internal Server Error';
      }
    }

    res.status(error.getStatus()).json({
      statusCode: error.getStatus(),
      error: error.response.name || error.name,
      message: error.response.message || error.message,
      errors: error.response.errors || null,
      timestamp: new Date().toISOString(),
      path: req ? req.url : null,
    });
  }
}
