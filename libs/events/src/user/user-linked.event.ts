import { LinkUserDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class UserLinkedEvent extends EventBase {
    constructor(
        public readonly body: LinkUserDto & {
            result: any;
        },
        public readonly uid: string
    ) {
        super();
    }
}
