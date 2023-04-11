import { EventBase } from "@ns/nats";

export class UserJoinedEvent extends EventBase {
    constructor(
        public readonly uid: string
    ){
        super()
    }
}