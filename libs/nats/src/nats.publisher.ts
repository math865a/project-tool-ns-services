import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { NATS } from "./_constants";
import { EventBase } from "./event-base";
import {instanceToPlain} from "class-transformer"

export class NatsPublisher {
    constructor(@Inject(NATS) private client: ClientProxy) {}

    publish(event: EventBase) {
        console.log(
            "Published event: ",
            event.constructor.name,
            " with data: ",
            event
        );
        const name = event.constructor.name;
        this.client.emit(name, instanceToPlain(event));
    }
}
