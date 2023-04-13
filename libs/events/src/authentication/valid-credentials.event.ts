import { EventBase } from "@ns/nats";

export class ValidCredentialsEvent extends EventBase {
    constructor(public readonly uid: string){
        super()
    }
}