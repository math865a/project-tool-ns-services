import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { MessagePattern } from "@nestjs/microservices";
import { calendarPatterns as patterns } from "@ns/endpoints";
import { CalendarOptionsQuery, DefaultCalendarQuery } from "./queries";

@Controller()
export class CalendarsNatsController {
    constructor(private queryBus: QueryBus) {}

    @MessagePattern(patterns.getDefaultCalendar)
    async getDefaultCalendar() {
        return this.queryBus.execute(new DefaultCalendarQuery());
    }

    @MessagePattern(patterns.getCalendarOptions)
    async getCalendarOptions() {
        return this.queryBus.execute(new CalendarOptionsQuery());
    }
}
