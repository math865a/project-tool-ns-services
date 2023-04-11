import { EventBase } from "@ns/nats";

export class UserLeftEvent extends EventBase {
    constructor(public readonly uid: string) {
        super()
    }
}
