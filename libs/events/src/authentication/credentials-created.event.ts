import { EventBase } from "@ns/nats";

export class CredentialsCreatedEvent extends EventBase {
    constructor(public readonly uid: string, public readonly sendWelcomeEmail: boolean){
        super()
    }
}