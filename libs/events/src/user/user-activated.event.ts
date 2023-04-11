import { ToggleActiveStatusDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class UserActivatedEvent extends EventBase {
    constructor(public readonly body: ToggleActiveStatusDto, public readonly uid: string){
        super()
    }
}