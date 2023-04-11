function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = 'resource-portfolio';

export const resourcePortfolioPatterns = {
    createAgent: getPattern('create:agent'),
    deleteAgent: getPattern('delete:agent'),
    getTeamOptions: getPattern('get:team-options'),
    getResourceAgents: getPattern('get:resource-agents'),
    getResourceTypeAgents: getPattern('get:resourcetype-agents'),
    getDeleteAgentConsequences: getPattern('get:delete-agent-consequences'),
};
