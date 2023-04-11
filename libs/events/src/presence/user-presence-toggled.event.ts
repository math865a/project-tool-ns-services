import { EventBase } from "@ns/nats";

export class UserPresenceChangedEvent extends EventBase {
    constructor(
        public readonly uid: string,
        public readonly isOnline: boolean
    ) {
        super();
    }
}
