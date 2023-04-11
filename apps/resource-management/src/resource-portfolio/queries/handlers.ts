import { ResourceAgentsQueryHandler } from "./resource-agents/resource-agents.handler";
import { ResourceTypeAgentsQueryHandler } from "./resourcetype-agents/resourcetype-agents.handler";
import { TeamOptionsQueryHandler } from "./team-options/team-options.handler";
import { DeleteAgentConsequencesQueryHandler } from "./delete-agent-consequences/delete-agent-consequences.handler";

export const queryHandlers = [
    ResourceAgentsQueryHandler,
    ResourceTypeAgentsQueryHandler,
    TeamOptionsQueryHandler,
    DeleteAgentConsequencesQueryHandler
];
