import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { DeleteAgentConsequencesQuery } from "./delete-agent-consequences.query";

@QueryHandler(DeleteAgentConsequencesQuery)
export class DeleteAgentConsequencesQueryHandler
    implements IQueryHandler<DeleteAgentConsequencesQuery, any>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(query: DeleteAgentConsequencesQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, query);
        const response: any = queryResult.records.map((rec) =>
            rec.get("affectedWorkpackage")
        );
        return response;
    }

    query = `
        MATCH (r:Resource)<-[:IS]-(agent:Agent)-[:IS]->(rt:ResourceType)
            WHERE agent.id = $agentId
        
        MATCH (agent)-[:IS_ASSIGNED_TO]->(p:Plan)<-[:HAS]-(w:Workpackage)--(bs:BookingStage)

        WITH p, 
            agent, 
            bs.name AS bookingStage, 
            w.name AS wName,
            w.systematicName AS wSystematicName, 
            w.id AS wId
        
        CALL {
            WITH p, agent
            MATCH (p)-[:HAS*3]-(a:Allocation)<-[:IS_ASSIGNED_TO]-(agent)
            MATCH (a)<-[:HAS]-(t:Task)
            WITH a, 
                t.name AS taskName, 
                round(a.defaultMinutes/60 + a.overtimeMinutes/60) AS work,
                apoc.temporal.format(a.startDate, "dd-MM-YYYY") AS startDate,
                apoc.temporal.format(a.endDate, "dd-MM-YYYY") AS endDate
            WITH collect({
                taskName: taskName,
                startDate: startDate,
                endDate: endDate,
                hours: apoc.text.join([toString(work), "timer"], " ")
            }) AS allocations, 
            apoc.text.join([toString(sum(work)), "timer"]," ") AS totalWork
            RETURN allocations, totalWork
        }

        RETURN {
            id: wId,
            name: wName,
            systematicName: wSystematicName,
            allocations: allocations,
            totalWork: totalWork
        } AS affectedWorkpackage
   `;
}
