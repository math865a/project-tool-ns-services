import { Module } from "@nestjs/common";
import { commandHandlers } from "./commands";
import { ProjectManagerNatsController } from "./project-manager.controller";
import { queryHandlers } from "./queries";

@Module({
    providers: [...queryHandlers, ...commandHandlers],
    controllers: [ProjectManagerNatsController],
})
export class ProjectManagerModule {}
