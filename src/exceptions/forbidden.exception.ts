import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenExceptionCustom extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response ?? 'Forbidden', HttpStatus.FORBIDDEN);
  }
}
