import { Module } from "@nestjs/common";
import { NatsModule } from "@ns/nats";
import { MongoModule } from "@ns/mongodb";
import { EventListener } from "./event-listener";
import { EventsService } from "./events.service";

@Module({
    imports: [NatsModule, MongoModule],
    controllers: [EventListener],
    providers: [EventsService],
})
export class EventLoggerModule {}
