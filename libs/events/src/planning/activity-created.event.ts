import { CreateActivityDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class ActivityCreatedEvent extends EventBase {
    constructor(public readonly body: CreateActivityDto, public readonly uid: string){
        super()
    }
}