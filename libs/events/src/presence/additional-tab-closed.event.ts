import { EventBase } from "@ns/nats";

export class AdditionalTabClosedEvent extends EventBase {
    constructor(public readonly uid: string, public readonly tabCount: number) {
        super();
    }
}
