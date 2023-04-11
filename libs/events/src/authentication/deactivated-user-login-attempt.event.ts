import { EventBase } from "@ns/nats";


export class DeactivatedUserLoginAttemptEvent extends EventBase {
    constructor(
        public readonly uid: string
    ){
        super();
    }
}