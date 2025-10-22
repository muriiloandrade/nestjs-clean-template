import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  DrizzleError,
  DrizzleQueryError,
  TransactionRollbackError,
} from 'drizzle-orm/errors';
import { DatabaseError } from 'pg';

@Catch(DrizzleError, DrizzleQueryError, TransactionRollbackError)
export class DrizzleErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(DrizzleErrorFilter.name);

  catch(
    exception: DrizzleError | DrizzleQueryError | TransactionRollbackError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { message, constraint, httpStatus } = getDbErrorMessage(exception);
    this.logger.error(`Database Error: ${message}, Constraint: ${constraint}`);
    return response.status(httpStatus).json({
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

type Handlers = {
  message: string;
  constraint: string | null;
  httpStatus?: HttpStatus;
};

// Defines the shape of the error handler functions
type ErrorHandler = (error: DatabaseError) => Handlers;

// Maps PostgreSQL error codes to specific handler functions
const postgresErrorHandlers: Record<string, ErrorHandler> = {
  '23505': (error) => ({
    message: 'A duplicate entry was found for a unique field.',
    constraint: error.constraint || null,
    httpStatus: HttpStatus.CONFLICT,
  }),
  '23503': (error) => ({
    message:
      'A foreign key violation occurred. The record you are trying to link does not exist.',
    constraint: error.constraint || null,
    httpStatus: HttpStatus.BAD_REQUEST,
  }),
  '22P02': () => ({
    message:
      'The data provided is in an invalid format (e.g., not a valid UUID).',
    constraint: null,
    httpStatus: HttpStatus.BAD_REQUEST,
  }),
  '23514': (error) => ({
    message: 'A check constraint was violated.',
    constraint: error.constraint || null,
    httpStatus: HttpStatus.BAD_REQUEST,
  }),
  '23502': (error) => ({
    message: `A required field is missing. The column '${error.column}' cannot be null.`,
    constraint: error.column || null,
    httpStatus: HttpStatus.BAD_REQUEST,
  }),
  '42703': (error) => ({
    message: 'An undefined column was referenced in the query.',
    constraint: error.column || null,
    httpStatus: HttpStatus.BAD_REQUEST,
  }),
  '42601': () => ({
    message: "There's a syntax error in the database query.",
    constraint: null,
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
  '25000': () => ({
    message:
      'Transaction failed: a data integrity issue occurred within a database transaction.',
    constraint: null,
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
  '08006': () => ({
    message: 'Database connection failed. The database may be unavailable.',
    constraint: null,
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
  '42P01': () => ({
    message: 'A referenced table does not exist in the database.',
    constraint: null,
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
  '40001': () => ({
    message:
      'Transaction serialization failure. Please retry the transaction as it could not be completed due to concurrent modifications.',
    constraint: null,
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
  default: (error) => ({
    message: `A database error occurred: ${error.message}`,
    constraint: null,
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
};

/**
 * Extracts a user-friendly message and constraint from a Drizzle ORM error.
 * @param error The error object from Drizzle.
 * @returns An object with the main error message and constraint name (if applicable).
 */
export function getDbErrorMessage(error: unknown): Handlers {
  if (
    error instanceof DrizzleQueryError &&
    error.cause instanceof DatabaseError
  ) {
    const originalError = error.cause;
    const handler = postgresErrorHandlers[originalError.code ?? 'default'];

    if (handler) {
      return handler(originalError);
    }

    // Default case for any other unhandled DatabaseError
    return {
      message: `A database error occurred: ${originalError.message}`,
      constraint: null,
    };
  }

  // Fallback for generic Drizzle errors or other Error instances
  if (error instanceof DrizzleError || error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred.',
      constraint: null,
    };
  }

  // Final fallback for unknown error types
  return { message: 'An unknown error occurred.', constraint: null };
}
