import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, NatsContext, Payload } from "@nestjs/microservices";
import { EventsService } from "./events.service";

@Controller()
export class EventListener {
    constructor(private eventsService: EventsService) {}

    @EventPattern("*")
    async handleEvent(@Payload() event: any, @Ctx() ctx: NatsContext) {
        await this.eventsService.persistEvent(ctx.getSubject(), event);
    }
}
