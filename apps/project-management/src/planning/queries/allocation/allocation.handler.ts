import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { AllocationQuery } from "./allocation.query";

@QueryHandler(AllocationQuery)
export class AllocationQueryHandler
    implements IQueryHandler<AllocationQuery, any>
{
    constructor(private client: Neo4jClient) {}

    async execute(query: AllocationQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, query);
        const response = queryResult.records[0].get("result");
        return response;
    }

    query = `
        MATCH (a:Allocation {id: $allocationId})
        MATCH (a)<-[:IS_ASSIGNED_TO]-(agent:Agent)
        RETURN {
            id: a.id,
            agentId: agent.id,
            startDate: apoc.temporal.format(a.startDate, "YYYY-MM-dd"),
            endDate: apoc.temporal.format(a.endDate, "YYYY-MM-dd"),
            defaultWork: round(a.defaultMinutes/60, 1),
            overtimeWork: round(a.overtimeMinutes/60,1)
        } AS result
`;
}
