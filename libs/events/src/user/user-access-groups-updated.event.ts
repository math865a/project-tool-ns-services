import { EventBase } from "@ns/nats";

export class UserAccessGroupsUpdatedEvent extends EventBase {
    constructor(
        public readonly uid: string,
        public readonly accessGroups: string[]
    ) {
        super();
    }
}
