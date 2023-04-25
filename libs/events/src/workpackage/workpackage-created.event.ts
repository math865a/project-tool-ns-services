import { EventBase } from "@ns/nats";

export class WorkpackageCreatedEvent extends EventBase {
    constructor(public readonly body: any, public readonly uid: string){
        super()
    }
}