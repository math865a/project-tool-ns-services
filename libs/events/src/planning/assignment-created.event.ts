import { CreateAssignmentDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class AssignmentCreatedEvent extends EventBase{
    constructor(public readonly body: CreateAssignmentDto, public readonly uid: string){
        super()
    }
}