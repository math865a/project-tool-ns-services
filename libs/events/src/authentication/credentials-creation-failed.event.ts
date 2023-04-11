import { EventBase } from "@ns/nats";

export class CredentialsCreationFailedEvent extends EventBase {
    constructor(public readonly uid: string){
        super()
    }
}