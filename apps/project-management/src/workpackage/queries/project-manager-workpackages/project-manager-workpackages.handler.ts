import { Neo4jClient } from "@ns/neo4j";
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ProjectManagerWorkpackagesQuery } from "./project-manager-workpackages.query";

@QueryHandler(ProjectManagerWorkpackagesQuery)
export class ProjectManagerWorkpackagesHandler
    implements IQueryHandler<ProjectManagerWorkpackagesQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(query: ProjectManagerWorkpackagesQuery): Promise<any[]> {
        const queryResult = await this.client.read(this.query, query);
        return queryResult.records.map((d) => d.get('row'));
    }

    query = `
        MATCH (w:Workpackage)--(plan:Plan)
            WHERE (plan)<-[:MANAGES]-(:ProjectManager {id: $id})

        CALL {
            WITH plan
            OPTIONAL MATCH (plan)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(r:Resource)
            WITH collect({
                id: r.id,
                name: r.name,
                color: r.color
                }) AS team
            RETURN CASE
                WHEN team[0].id IS NULL THEN []
                ELSE team
            END AS team

        }


        CALL {
            WITH w
            RETURN
                w.id AS id,
                w.serialNo AS serialNo,
                w.systematicName AS systematicName,
                w.name AS name
        }

        CALL {
            WITH w
            MATCH (w)--(c:Contract)
            RETURN {
                id: c.id,
                name: c.name
            } AS contract
        }

        CALL {
            WITH w
            MATCH (w)--(f:FinancialSource)
            RETURN {
                id: f.id,
                name: f.name
            } AS financialSource
        }

        CALL {
            WITH w
            MATCH (w)--(s:Stage)
            RETURN {
                id: s.id,
                name: s.name,
                color: s.color,
                sequence: s.sequence
            } AS stage
        }

        CALL {
            WITH w
            MATCH (w)--(bs:BookingStage)
            RETURN {
                id: bs.id,
                name: bs.name,
                color: bs.color,
                sequence: bs.sequence
            } AS bookingStage
        }

        CALL {
            WITH plan
            MATCH (plan)<-[:MANAGES]-(pm:ProjectManager)
            RETURN {
                id: pm.id,
                name: pm.name,
                color: pm.color
            } AS projectManager
        }

        CALL {
            WITH plan
            RETURN 
                apoc.temporal.format(plan.startDate, "YYYY-MM-dd") AS startDate,
                apoc.temporal.format(plan.endDate, "YYYY-MM-dd") AS endDate
        }

        CALL {
            WITH plan
            RETURN round((plan.defaultWork + plan.overtimeWork)/60,1) AS work
        }


        RETURN {
            id: id,
            serialNo: serialNo,
            systematicName: systematicName,
            name: name,
            contract: contract,
            financialSource: financialSource,
            stage: stage,
            bookingStage: bookingStage,
            projectManager: projectManager,
            startDate: startDate,
            endDate: endDate,
            work: work,
            team: team        
        } AS row
        ORDER BY row.stage.sequence
   `;
}
/*       



        CALL {
            WITH plan
            OPTIONAL MATCH (plan)<-[:IS_ASSIGNED_TO]-(:Agent)--(resource:Resource)
            WITH collect({id: resource.id, name: resource.name, color: resource.color}) AS resources
            RETURN CASE
                WHEN resources[0].id IS NOT NULL
                    THEN resources
                ELSE []
            END AS resources
        }
CALL {
            WITH w
            MATCH (w)--(proposition:Proposition)<-[:MANAGES]-(pm:ProjectManager)
            OPTIONAL MATCH (proposition)--(proposals:Proposal)
            WITH count(proposals) AS tblCount, {
                id: pm.id,
                name: pm.name,
                color: pm.color
            } AS propositionManager
            RETURN tblCount, propositionManager
        }*/
