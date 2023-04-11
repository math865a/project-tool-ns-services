import { Module } from "@nestjs/common";
import { commandHandlers } from "./commands";
import { AccessGroupsController } from "./access-group.controller";
import { queryHandlers } from "./queries";

@Module({
    providers: [...queryHandlers, ...commandHandlers],
    controllers: [AccessGroupsController],
})
export class AccessGroupModule {}
