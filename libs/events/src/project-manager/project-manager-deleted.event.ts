import { EventBase } from "@ns/nats";

export class ProjectManagerDeletedEvent extends EventBase {
    constructor(public readonly id: string, public readonly uid: string) {
        super();
    }
}
