import { Module } from "@nestjs/common";
import { commandHandlers } from "./commands";
import { queryHandlers } from "./queries";
import { UsersNatsController } from "./user.controller";

@Module({
    providers: [...queryHandlers, ...commandHandlers],
    controllers: [UsersNatsController],
})
export class UserModule {}
