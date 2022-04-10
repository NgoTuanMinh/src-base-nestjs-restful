import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundExceptionCustom extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response ?? 'Not Found', HttpStatus.NOT_FOUND);
  }
}
