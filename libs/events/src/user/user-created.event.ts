import { CreateUserDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class UserCreatedEvent extends EventBase {
    constructor(
        public readonly body: CreateUserDto & {uid: string},
        public readonly uid: string
    ) {
        super();
    }
}
