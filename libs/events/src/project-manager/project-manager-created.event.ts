import { CreateProjectManagerDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class ProjectManagerCreatedEvent extends EventBase {
    constructor(public readonly body: CreateProjectManagerDto, public readonly uid: string){
        super()
    }
}