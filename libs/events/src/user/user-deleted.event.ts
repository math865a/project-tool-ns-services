import { EventBase } from "@ns/nats"

export class UserDeletedEvent extends EventBase {
    constructor(public readonly body: {
        uid: string
    }, public readonly uid: string){
        super()
    }
}