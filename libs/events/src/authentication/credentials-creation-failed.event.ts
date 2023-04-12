import { CreateCredentialsDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class CredentialsCreationFailedEvent extends EventBase {
    constructor(public readonly dto: CreateCredentialsDto, public readonly uid: string){
        super()
    }
}