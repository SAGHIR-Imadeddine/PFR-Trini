import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../users/entities/user.entity';

export const Authenticated = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);