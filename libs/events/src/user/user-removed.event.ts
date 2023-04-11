import { EventBase } from "@ns/nats"

export class UserRemovedEvent extends EventBase {
    constructor(public readonly body: {
        uid: string
    }, public readonly uid: string){
        super()
    }
}