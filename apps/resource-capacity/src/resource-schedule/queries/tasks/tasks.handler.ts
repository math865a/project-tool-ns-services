import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { TasksQuery } from "./tasks.query";
import { Neo4jClient } from "@ns/neo4j";

@QueryHandler(TasksQuery)
export class TasksHandler implements IQueryHandler<TasksQuery> {
    constructor(private client: Neo4jClient) {}

    async execute(query: TasksQuery): Promise<any> {
        console.log(query.instruction)
        const queryResult = await this.client.read(this.query, {
            ...query.instruction,
        });
        return queryResult.records.map((record) => record.get("task"));
    }

    query = `
        MATCH (a:Allocation)--(t:Task)<-[:HAS]-(d:Delivery)<-[:HAS]-(p:Plan)<-[:HAS]-(w:Workpackage)
            WHERE (a)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(:Resource {id: $id})
            AND date(a.startDate) <= date($end) 
            AND date(a.endDate) >= date($start)
        MATCH (p)<-[:MANAGES]-(pm:ProjectManager)
        MATCH (w)--(bs:BookingStage)
        MATCH (w)--(s:Stage)

        WITH collect({
            id: a.id,
            work: round((a.defaultMinutes + a.overtimeMinutes)/60, 2),
            start: apoc.temporal.format(a.startDate, 'YYYY-MM-dd'),
            end: apoc.temporal.format(a.endDate, 'YYYY-MM-dd'),
            display: {
                period: {
                    start: apoc.temporal.format(a.startDate, 'dd-MM-YYYY'),
                    end: apoc.temporal.format(a.endDate, 'dd-MM-YYYY')
                },
                work: apoc.text.join([toString(round((a.defaultMinutes + a.overtimeMinutes)/60, 2)), 'timer'], ' ')
            }
        }) AS allocations, t, d, p, w, bs, pm, s

        CALL {
            WITH t
            MATCH (t)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(r:Resource)
            RETURN collect({
                id: r.id,
                name: r.name,
                color: r.color
            }) AS taskTeam
        }

        CALL {
            WITH allocations
            UNWIND allocations AS allocation
            WITH round(sum(allocation.work), 2) as totalWork,
            apoc.temporal.format(min(date(allocation.start)), 'yyyy-MM-dd') AS start,
            apoc.temporal.format(max(date(allocation.end)), 'yyyy-MM-dd') AS end
            RETURN start, end, totalWork
        }

        RETURN {
            id: t.id,
            color: d.color,
            title: t.name,
            allocatedPeriod: {
                start: start,
                end: end
            },
            display: {
                allocatedPeriod: {
                    start: apoc.temporal.format(start, 'dd-MM-YYYY'),
                    end: apoc.temporal.format(end, 'dd-MM-YYYY')
                },
                period: {
                    start: apoc.temporal.format(t.startDate, 'dd-MM-YYYY'),
                    end: apoc.temporal.format(t.endDate, 'dd-MM-YYYY')
                },
                work: apoc.text.join([toString(totalWork), 'timer'], ' ')
            },
            start: apoc.temporal.format(t.startDate, 'YYYY-MM-dd'),
            end: apoc.temporal.format(t.endDate, 'YYYY-MM-dd'),
            work: totalWork,
            allocations: allocations,
            team: taskTeam,
            projectManager: {
                id: pm.id,
                name: pm.name,
                color: pm.color
            },
            workpackage: {
                id: w.id,
                name: w.name,
                systematicName: w.systematicName
            },
            bookingStage: {
                id: bs.id,
                name: bs.name,
                color: bs.color,
                sequence: bs.sequence
            },
            stage: {
                id: s.id,
                name: s.name,
                color: s.color,
                sequence: s.sequence
            }
        } AS task

    `;
}
