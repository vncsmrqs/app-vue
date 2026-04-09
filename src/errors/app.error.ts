import { ErrorEnum } from '@/enums/error.enum';

type AppErrorConstructor<T extends AppError> = new (...args: never[]) => T;

export function isAppErrorOfType<T extends AppError>(
  candidate: unknown,
  errorCode: string,
  ctor?: AppErrorConstructor<T>,
): candidate is T {
  if (!AppError.is(candidate)) return false;

  if (ctor && !(candidate instanceof ctor)) return false;

  return candidate.code === errorCode;
}

export class AppError extends Error {
  public readonly isAppError = true;
  constructor(
    public readonly code: string,
    message: string | string[],
    public readonly data?: unknown,
  ) {
    super(Array.isArray(message) ? message.join(', ') : message);

    this.name = code;
    this.code = code;
    this.data = data;
  }

  static is(candidate: unknown): candidate is AppError {
    return (
      candidate instanceof AppError ||
      (typeof candidate === 'object' && candidate !== null && 'isAppError' in candidate)
    );
  }
}

export class CanceledError extends AppError {
  constructor(message: string | string[] = 'Request canceled error', data?: never) {
    super(ErrorEnum.CANCELED_ERROR, message, data);
  }

  static is(candidate: unknown): candidate is CanceledError {
    return isAppErrorOfType(candidate, ErrorEnum.CANCELED_ERROR, CanceledError);
  }
}

export class GenericError extends AppError {
  constructor(message: string | string[] = 'Generic error', data?: never) {
    super(ErrorEnum.GENERIC_ERROR, message, data);
  }

  static is(candidate: unknown): candidate is GenericError {
    return isAppErrorOfType(candidate, ErrorEnum.GENERIC_ERROR, GenericError);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string | string[] = 'Resource Not Found', data?: never) {
    super(ErrorEnum.NOT_FOUND_ERROR, message, data);
  }

  static is(candidate: unknown): candidate is NotFoundError {
    return isAppErrorOfType(candidate, ErrorEnum.NOT_FOUND_ERROR, NotFoundError);
  }
}

export class ServiceError extends AppError {
  constructor(message: string | string[] = 'Service problem', data?: unknown) {
    super(ErrorEnum.SERVICE_ERROR, message, data);
  }

  static is(candidate: unknown): candidate is ServiceError {
    return isAppErrorOfType(candidate, ErrorEnum.SERVICE_ERROR, ServiceError);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string | string[] = 'Not authenticated', data?: unknown) {
    super(ErrorEnum.NOT_AUTHENTICATED_ERROR, message, data);
  }

  static is(candidate: unknown): candidate is AuthenticationError {
    return isAppErrorOfType(candidate, ErrorEnum.NOT_AUTHENTICATED_ERROR, AuthenticationError);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string | string[] = 'Not authenticated', data?: unknown) {
    super(ErrorEnum.NOT_AUTHORIZED_ERROR, message, data);
  }

  static is(candidate: unknown): candidate is AuthorizationError {
    return isAppErrorOfType(candidate, ErrorEnum.NOT_AUTHORIZED_ERROR, AuthorizationError);
  }
}

export class ValidationError extends AppError {
  constructor(message: string | string[] = 'Invalid data sent', data?: unknown) {
    super(ErrorEnum.VALIDATION_ERROR, message, data);
  }

  static is(candidate: unknown): candidate is ValidationError {
    return isAppErrorOfType(candidate, ErrorEnum.VALIDATION_ERROR, ValidationError);
  }
}

export class ClientError extends AppError {
  constructor(message: string | string[] = 'Bad request', data?: unknown) {
    super(ErrorEnum.CLIENT_ERROR, message, data);
  }

  static is(candidate: unknown): candidate is ClientError {
    return isAppErrorOfType(candidate, ErrorEnum.CLIENT_ERROR, ClientError);
  }
}
