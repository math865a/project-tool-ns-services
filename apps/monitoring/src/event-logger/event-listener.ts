import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { EventsService } from "./events.service";

@Controller()
export class EventListener {
    constructor(private eventsService: EventsService){}

    @EventPattern("*")
    async handleEvent(event:any){
        await this.eventsService.persistEvent(event);
        console.log("Event received: ", event)
    }
}