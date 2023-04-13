import { EventBase } from "@ns/nats";

export class ActivityUpdatedEvent extends EventBase {
    constructor(public readonly body: any, public readonly uid: string) {
        super();
    }
}
