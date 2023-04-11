import { UpdateProjectManagerDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class ProjectManagerUpdatedEvent extends EventBase {
    constructor(public readonly body: UpdateProjectManagerDto, public readonly uid: string){
        super()
    }
}