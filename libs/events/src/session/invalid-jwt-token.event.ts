import { EventBase } from "@ns/nats";

export class InvalidJwtTokenEvent extends EventBase {
    constructor(){
        super()
    }
}