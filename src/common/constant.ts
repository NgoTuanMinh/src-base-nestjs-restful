export const DB = {
  TYPE: 'postgres',
  POSTGRES_HOST: 'POSTGRES_HOST',
  POSTGRES_PORT: 'POSTGRES_PORT',
  POSTGRES_USER: 'POSTGRES_USER',
  POSTGRES_PASSWORD: 'POSTGRES_PASSWORD',
  POSTGRES_DB: 'POSTGRES_DB',
  REDIS_HOST: 'REDIS_HOST',
  REDIS_PORT: 'REDIS_PORT',
};

export const SALT_ROUND = 12;

export const ERROR_RESPONSE = {
  INTERNAL_ERROR: {
    name: 'INTERNAL_ERROR',
    statusCode: 500,
  },
  UNAUTHORIZED_ERROR: {
    name: 'UNAUTHORIZED_ERROR',
    statusCode: 401,
  },
  NOT_FOUND_ERROR: {
    name: 'NOT_FOUND_ERROR',
    statusCode: 404,
  },
  CONFLICT_ERROR: {
    name: 'CONFLICT_ERROR',
    statusCode: 409,
  },
  FORBIDDEN_ERROR: {
    name: 'FORBIDDEN_ERROR',
    statusCode: 403,
  },
  EXPIRE_TOKEN_ERROR: {
    name: 'EXPIRE_TOKEN_ERROR',
    statusCode: 401,
  },
  BADREQUEST_ERROR: {
    name: 'BADREQUEST_ERROR',
    statusCode: 400,
  },
  ARGUMENTS_ERROR: {
    name: 'ARGUMENTS_ERROR',
    statusCode: 400,
  },
  VALIDATION_ERROR: {
    name: 'VALIDATION_ERROR',
    statusCode: 422,
  },
  ACCOUNT_SUSPEN_ERROR: {
    name: 'ACCOUNT_SUSPEN_ERROR',
    statusCode: 402,
  },
  ACCOUNT_LOGOUT_ERROR: {
    name: 'ACCOUNT_LOGOUT_ERROR',
    statusCode: 412,
  },
};

export const APP_GUARD = 'APP_GUARD';

export enum GUARDS {
  AUTH_GUARD = 'AUTH_GUARD',
  ADMIN_GUARD = 'ADMIN_GUARD',
  CHANGE_PASSWORD_GUARD = 'CHANGE_PASSWORD_GUARD',
}

export const HEADER_AUTHEN_NAME = 'authorization';

export const DECORATORS = {
  IS_PUBLIC_GUARD: 'isPublic',
};
