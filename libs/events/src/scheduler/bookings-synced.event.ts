import { EventBase } from "@ns/nats";

export class BookingsSyncedEvent extends EventBase {
    constructor(public readonly body: any, public readonly uid: string){
        super()
    }
}