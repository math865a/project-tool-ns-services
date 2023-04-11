import { EventBase } from "@ns/nats";

export class ResourceDeletedEvent extends EventBase {
    constructor(public readonly body: {
        id: string
    }, public readonly uid: string){
        super()
    }
}