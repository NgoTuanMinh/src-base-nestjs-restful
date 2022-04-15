import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictExceptionCustom extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response ?? 'CONFLICT', HttpStatus.CONFLICT);
  }
}
