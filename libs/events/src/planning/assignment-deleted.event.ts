import { DeleteAssignmentDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class AssignmentDeletedEvent extends EventBase {
    constructor(
        public readonly body: DeleteAssignmentDto,
        public readonly uid: string
    ) {
        super();
    }
}
