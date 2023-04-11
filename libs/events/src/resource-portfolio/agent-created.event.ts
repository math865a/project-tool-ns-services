import { CreateAgentDto } from "@ns/dto";
import { EventBase } from "@ns/nats";

export class AgentCreatedEvent extends EventBase {
    constructor(
        public readonly body: CreateAgentDto & { agentId: string },
        public readonly uid: string
    ) {
        super();
    }
}
