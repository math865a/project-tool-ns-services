import { EventBase } from "@ns/nats";

export class InvalidCredentialsEvent extends EventBase {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {
        super();
    }
}
