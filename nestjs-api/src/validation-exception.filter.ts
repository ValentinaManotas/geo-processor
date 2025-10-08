import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const errorResponse = exception.getResponse() as any;

    let formattedErrors = '';

    if (Array.isArray(errorResponse.message)) {
      const errorsByField: { [field: string]: string[] } = {};

      errorResponse.message.forEach((msg: string) => {
        if (msg.includes('points array should not be empty')) {
          errorsByField['points'] = errorsByField['points'] || [];
          errorsByField['points'].push(`Input points[] is invalid: ${msg}`);
          return;
        }

        const match = msg.match(/points\.(\d+)\.(\w+)/);
        const valueMatch = msg.match(/'([^']+)'/);

        const field = match ? match[2] : 'unknown';
        const index = match ? match[1] : 'unknown';
        const value = valueMatch ? valueMatch[1] : 'unknown';

        if (!errorsByField[field]) errorsByField[field] = [];
        errorsByField[field].push(`Input points[${index}] ${field} is invalid: ${msg.replace(/points\.\d+\.\w+\s*/, '')}`);
      });

      formattedErrors = Object.keys(errorsByField)
        .map(field => {
          return `${errorsByField[field].join('; ')}`;
        })
        .join('; ');

    } else if (typeof errorResponse.message === 'string') {
      formattedErrors = `Field 'unknown' has error: ${errorResponse.message}`;
    } else {
      formattedErrors = 'Validation failed';
    }

    response.status(400).json({
      success: false,
      message: formattedErrors,
      results: {}
    });
  }
}