import { EventBase } from "@ns/nats";

export class ResourceRemovedEvent extends EventBase {
    constructor(public readonly body: {
        id: string
    }, public readonly uid: string){
        super()
    }
}