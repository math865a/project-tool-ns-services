import { Module } from "@nestjs/common";
import { commandHandlers } from "./commands";
import { queryHandlers } from "./queries";
import { ResourceTypeNastController } from "./resourcetype.controller";

@Module({
    providers: [...commandHandlers, ...queryHandlers],
    controllers: [ResourceTypeNastController]
})
export class ResourceTypeModule {}