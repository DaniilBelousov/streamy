import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

import {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_UNAUTHORIZED,
  ERROR_CODE_FORBIDDEN,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_SYSTEM_ERROR,
  ERROR_MESSAGE_BAD_REQUEST,
  ERROR_MESSAGE_UNAUTHORIZED,
  ERROR_MESSAGE_FORBIDDEN,
  ERROR_MESSAGE_NOT_FOUND,
  ERROR_MESSAGE_SYSTEM_ERROR,
} from './constants.js';

interface ICommonError {
  statusCode: number;
  message: string;
  code: string;
}

interface NextError {
  message?: string;
  code?: string;
}

export class CommonError {
  public statusCode: number;
  public message: string;
  public code: string;

  constructor(props: ICommonError) {
    this.message = props.message;
    this.code = props.code;
    this.statusCode = props.statusCode;
  }
}

export class BadRequest extends CommonError {
  constructor({ message, code }: NextError = {}) {
    super({
      statusCode: 400,
      message: message || ERROR_MESSAGE_BAD_REQUEST,
      code: code || ERROR_CODE_BAD_REQUEST,
    });
  }
}

export class Unauthorized extends CommonError {
  constructor({ message, code }: NextError = {}) {
    super({
      statusCode: 401,
      message: message || ERROR_MESSAGE_UNAUTHORIZED,
      code: code || ERROR_CODE_UNAUTHORIZED,
    });
  }
}

export class Forbidden extends CommonError {
  constructor({ message, code }: NextError = {}) {
    super({
      statusCode: 403,
      message: message || ERROR_MESSAGE_FORBIDDEN,
      code: code || ERROR_CODE_FORBIDDEN,
    });
  }
}

export class NotFound extends CommonError {
  constructor({ message, code }: NextError = {}) {
    super({
      statusCode: 404,
      message: message || ERROR_MESSAGE_NOT_FOUND,
      code: code || ERROR_CODE_NOT_FOUND,
    });
  }
}

export class SystemError extends CommonError {
  constructor({ message, code }: NextError = {}) {
    super({
      statusCode: 500,
      message: message || ERROR_MESSAGE_SYSTEM_ERROR,
      code: code || ERROR_CODE_SYSTEM_ERROR,
    });
  }
}

export const handleAppError = (
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.log.error(error);
  const statusCode = error.statusCode || 500;
  if (statusCode === 500) {
    const systemError = new SystemError();
    reply.statusCode = systemError.statusCode;
    reply.send(systemError);
  } else {
    reply.statusCode = statusCode;
    reply.send(error);
  }
};
