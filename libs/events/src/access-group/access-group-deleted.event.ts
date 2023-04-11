import { EventBase } from "@ns/nats";

export class AccessGroupDeletedEvent extends EventBase {
    constructor(
        public readonly affectedUsers: string[],
        public readonly uid: string
    ) {
        super();
    }
}
