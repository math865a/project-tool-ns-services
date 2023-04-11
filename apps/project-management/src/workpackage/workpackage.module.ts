import { Module } from "@nestjs/common";
import { commandHandlers } from "./commands";
import { WorkpackageNatsController } from "./workpackage.controller";
import { queryHandlers } from "./queries";

@Module({
    providers: [...commandHandlers, ...queryHandlers],
    controllers: [WorkpackageNatsController],
})
export class WorkpackageModule {}
