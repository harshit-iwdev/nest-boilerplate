/**
 * Global Transform Interceptor to standardize successful API responses.
 * It intercepts the data returned by route handlers and wraps it into a consistent JSON structure.
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface defining the standard structure of an API response.
 * @template T The type of the data payload.
 */
export interface Response<T> {
  success: boolean; // Indicates if the operation was successful
  data: T;          // The actual payload data returned by the handler
  message?: string; // Optional success message
}

/**
 * The @Injectable decorator marks this class as a provider that can be injected.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  /**
   * Intercepts the request/response stream.
   * @param context Provides details about the current execution context (request/response).
   * @param next Invokes the route handler and returns an Observable of the response.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // next.handle() executes the actual route handler logic.
    // We use the RxJS `map` operator to transform the emitted data before sending it to the client.
    return next.handle().pipe(
      map((data) => {
        // Extract the message from the data payload if the handler explicitly returned one
        const message = data?.message;
        
        // If the handler returned an object containing a 'message' property,
        // we remove it from the 'data' payload to avoid duplicating it in the root response.
        if (data && data.message) {
          delete data.message;
        }

        // Return the standardized response structure
        return {
          success: true, // Always true since this interceptor only processes successful responses
          message: message || 'Request successful', // Default message if none was provided
          data: data, // The sanitized payload
        };
      }),
    );
  }
}
