import { Module } from "@nestjs/common";
import { commandHandlers } from "./commands";
import { PlanningNatsController } from "./planning.controller";
import { queryHandlers } from "./queries";

@Module({
    providers: [...queryHandlers, ...commandHandlers],
    controllers: [PlanningNatsController],
})
export class PlanningModule {}
