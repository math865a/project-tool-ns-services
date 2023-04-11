import { UpdateUserDetailsDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class UserDetailsUpdatedEvent extends EventBase {
    constructor(
        public readonly body: UpdateUserDetailsDto,
        public readonly uid: string
    ) {
        super();
    }
}
