import { Module } from "@nestjs/common";
import { commandHandlers } from "./commands";
import { TeamNatsController } from "./team.controller";
import { queryHandlers } from "./queries";

@Module({
    providers: [...queryHandlers, ...commandHandlers],
    controllers: [TeamNatsController],
})
export class TeamModule {}
