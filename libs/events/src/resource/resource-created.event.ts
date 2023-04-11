import { CreateResourceDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class ResourceCreatedEvent extends EventBase {
    constructor(public readonly body: CreateResourceDto, public readonly uid: string){
        super()
    }
}