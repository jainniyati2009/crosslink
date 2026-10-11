import { ZodError } from 'zod';
import { AppError, responseError } from './api-errors';
export function route(handler: (request: Request, context: any) => Promise<Response>) {
  return async (request: Request, context: any) => {
    try { return await handler(request, context); }
    catch (error) {
      if (error instanceof ZodError) return responseError(new AppError(422, 'INVALID_INPUT', error.issues.map(i => i.message).join(' ')));
      return responseError(error);
    }
  };
}
