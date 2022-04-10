import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAccount = createParamDecorator(
  (data, context: ExecutionContext) => {
    const currentAccount = context?.switchToHttp()?.getRequest()['user'] || {};
    return currentAccount;
  },
);
