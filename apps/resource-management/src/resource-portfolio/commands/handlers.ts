import { CreateAgentHandler } from "./create-agent";
import { DeleteAgentHandler } from "./delete-agent";
import { DeleteOrphanAgentsHandler } from "./delete-orphan-agents";

export const commandHandlers = [CreateAgentHandler, DeleteAgentHandler, DeleteOrphanAgentsHandler]