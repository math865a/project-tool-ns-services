import { PipedUpsertAccessGroupDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class AccessGroupUpdatedEvent extends EventBase {
    constructor(public readonly body: PipedUpsertAccessGroupDto, public readonly uid: string){
        super()
    }
}