import { CreateAllocationDto } from "@ns/dto";
import { EventBase } from "@ns/nats";


export class AllocationCreatedEvent extends EventBase {
    constructor(
        public readonly body: CreateAllocationDto,
        public readonly uid: string
    ) {
        super()
    }
}
