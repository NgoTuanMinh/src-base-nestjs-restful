import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestExceptionCustom extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response ?? 'BAD REQUEST', HttpStatus.BAD_REQUEST);
  }
}
