import { EventBase } from "@ns/nats";

export class ProjectManagerRemovedEvent extends EventBase {
    constructor(public readonly id: string, public readonly uid: string) {
        super();
    }
}