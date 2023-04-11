import { createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator((data: any, ctx: any) => {

    return ctx.args[0].handshake.auth.uid;
});
