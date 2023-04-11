import { UpdateAllocationDto } from "@ns/dto";
import { EventBase } from "@ns/nats";


export class AllocationUpdatedEvent extends EventBase {
    constructor(
        public readonly body: UpdateAllocationDto,
        public readonly uid: string
    ){
        super()
    }
}