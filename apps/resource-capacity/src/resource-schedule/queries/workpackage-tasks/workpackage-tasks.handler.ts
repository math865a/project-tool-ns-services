import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { WorkpackageTasksQuery } from "./workpackage-tasks.query";

@QueryHandler(WorkpackageTasksQuery)
export class WorkpackageTasksQueryHandler
    implements IQueryHandler<WorkpackageTasksQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute({
        instruction,
        workpackageId,
    }: WorkpackageTasksQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, {
            ...instruction,
            workpackageId,
        });
        return queryResult.records[0]?.get("result");
    }

    query = `
        MATCH (r:Resource)
            WHERE r.id = $resourceId

        MATCH (w:Workpackage)
            WHERE w.id = $workpackageId 
        
        CALL {
            WITH w
            MATCH (w)--(:Plan)<-[:MANAGES]-(pm:ProjectManager)
            RETURN {
                id: pm.id,
                name: pm.name,
                color: pm.color
            } AS projectManager
        }
        
        CALL {
            WITH w, r
            MATCH (w)-[:HAS*2]-(d:Delivery)-[:HAS]->(t:Task)-[:HAS]->(a:Allocation)
                WHERE (a)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(r)
                AND date(a.startDate) <= date($endDate) AND date($startDate) <= date(a.endDate)
            WITH {
                id: a.id,
                deliveryName: d.name,
                taskName: t.name,
                color: d.color,
                interval: {
                    start: apoc.temporal.format(a.startDate, "iso_date"),
                    end: apoc.temporal.format(a.endDate, "iso_date")
                },
                displayInterval: {
                    start: apoc.temporal.format(a.startDate, "dd/MM/YYYY"),
                    end: apoc.temporal.format(a.endDate, "dd/MM/YYYY")
                },
                work: {
                    default: round(a.defaultMinutes/60),
                    overtime: round(a.overtimeMinutes/60)
                },
                workDisplay: apoc.text.join([toString(round((a.defaultMinutes+a.overtimeMinutes)/60)), "timer"], " ")
            } AS allocation
            WITH collect(allocation) AS allocations
            RETURN allocations
        }
        
        RETURN {
            tasks: allocations,
            projectManager: projectManager
        } AS result
    `;
}
