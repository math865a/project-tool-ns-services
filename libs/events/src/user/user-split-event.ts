import { EventBase } from "@ns/nats";

export class UserSplitEvent extends EventBase {
    constructor(
        public readonly body: {
            userNode: any;
            resourceNode: any;
        },
        public readonly uid: string
    ) {
        super();
    }
}
