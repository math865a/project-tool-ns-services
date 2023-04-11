import { EventBase } from "@ns/nats";

export class UsernameUpdatedEvent extends EventBase {
    constructor(
        public readonly email: string,
        public readonly uid: string
    ) {
        super()
    }
}