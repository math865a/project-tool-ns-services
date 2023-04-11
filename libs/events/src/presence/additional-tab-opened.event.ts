import { EventBase } from "@ns/nats";

export class AdditionalTabOpenedEvent extends EventBase {
    constructor(
        public readonly uid: string,
        public readonly tabCount: number
    ) {
        super()
    }
}
