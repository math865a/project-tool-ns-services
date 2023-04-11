import { Module } from "@nestjs/common";
import { commandHandlers } from "./commands";
import { queryHandlers } from "./queries";
import { ResourceNatsController } from "./resource.controller";

@Module({
    providers: [...commandHandlers, ...queryHandlers],
    controllers: [ResourceNatsController]
})
export class ResourceModule {}