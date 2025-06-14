import { ErrorEnum } from '@/enums/error.enum';

export class AppError extends Error {
  public readonly isAppError = true;
  constructor(
    public readonly code: string,
    message: string | string[],
    public readonly data?: never,
  ) {
    super(Array.isArray(message) ? message.join(', ') : message);

    this.name = code;
    this.code = code;
    this.data = data;
  }

  static is(candidate: any): candidate is AppError {
    return candidate instanceof AppError || candidate?.isAppError;
  }
}

export class CanceledError extends AppError {
  constructor(message: string | string[] = 'Request canceled error', data?: never) {
    super(ErrorEnum.CANCELED_ERROR, message, data);
  }

  static is(candidate: any): candidate is CanceledError {
    return candidate instanceof CanceledError || candidate?.code === ErrorEnum.CANCELED_ERROR;
  }
}

export class GenericError extends AppError {
  constructor(message: string | string[] = 'Generic error', data?: never) {
    super(ErrorEnum.GENERIC_ERROR, message, data);
  }

  static is(candidate: any): candidate is GenericError {
    return candidate instanceof GenericError || candidate?.code === ErrorEnum.GENERIC_ERROR;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string | string[] = 'Resource Not Found', data?: never) {
    super(ErrorEnum.NOT_FOUND_ERROR, message, data);
  }

  static is(candidate: any): candidate is NotFoundError {
    return candidate instanceof NotFoundError || candidate?.code === ErrorEnum.NOT_FOUND_ERROR;
  }
}

export class ServiceError extends AppError {
  constructor(message: string | string[] = 'Service problem', data?: any) {
    super(ErrorEnum.SERVICE_ERROR, message, data);
  }

  static is(candidate: any): candidate is ServiceError {
    return candidate instanceof ServiceError || candidate?.code === ErrorEnum.SERVICE_ERROR;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string | string[] = 'Not authenticated', data?: any) {
    super(ErrorEnum.NOT_AUTHENTICATED_ERROR, message, data);
  }

  static is(candidate: any): candidate is AuthenticationError {
    return (
      candidate instanceof AuthenticationError ||
      candidate?.code === ErrorEnum.NOT_AUTHENTICATED_ERROR
    );
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string | string[] = 'Not authenticated', data?: never) {
    super(ErrorEnum.NOT_AUTHORIZED_ERROR, message, data);
  }

  static is(candidate: any): candidate is AuthorizationError {
    return (
      candidate instanceof AuthorizationError || candidate?.code === ErrorEnum.NOT_AUTHORIZED_ERROR
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string | string[] = 'Invalid data sent', data?: never) {
    super(ErrorEnum.VALIDATION_ERROR, message, data);
  }

  static is(candidate: any): candidate is ValidationError {
    return candidate instanceof ValidationError || candidate?.code === ErrorEnum.VALIDATION_ERROR;
  }
}

export class ClientError extends AppError {
  constructor(message: string | string[] = 'Bad request', data?: never) {
    super(ErrorEnum.CLIENT_ERROR, message, data);
  }

  static is(candidate: any): candidate is ClientError {
    return candidate instanceof ClientError || candidate?.code === ErrorEnum.CLIENT_ERROR;
  }
}
