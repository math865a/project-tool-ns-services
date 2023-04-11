import { Module } from "@nestjs/common";
import { CalendarsNatsController } from "./calendar.controller";
import { commandHandlers } from "./commands";
import { queryHandlers } from "./queries";

@Module({
    providers: [...commandHandlers, ...queryHandlers],
    controllers: [CalendarsNatsController],
})
export class CalendarModule {}
