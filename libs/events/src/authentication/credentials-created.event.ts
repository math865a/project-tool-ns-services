import { CreateCredentialsDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class CredentialsCreatedEvent extends EventBase {
    constructor(
        public readonly body: CreateCredentialsDto,
        public readonly uid: string
    ) {
        super();
    }
}
