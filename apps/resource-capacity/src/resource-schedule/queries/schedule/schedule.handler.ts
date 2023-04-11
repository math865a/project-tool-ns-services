import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ScheduleQuery } from "./schedule.query";
import { Neo4jClient } from "@ns/neo4j";

@QueryHandler(ScheduleQuery)
export class ScheduleHandler implements IQueryHandler<ScheduleQuery, any> {
    constructor(private client: Neo4jClient) {}

    async execute(query: ScheduleQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, {
            ...query.instruction,
        });
        return queryResult.records.map((record) => record.get("event"));
    }

    query = `
        MATCH (a:Allocation)--(t:Task)<-[:HAS]-(d:Delivery)<-[:HAS]-(p:Plan)<-[:HAS]-(w:Workpackage)--(bs:BookingStage)
            WHERE (a)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(:Resource {id: $id})
            AND date(a.startDate) <= date($end) AND date(a.endDate) >= date($start)
        MATCH (p)<-[:MANAGES]-(pm:ProjectManager)
        RETURN {
            id: a.id,
            taskId: t.id,
            color: d.color,
            title: t.name,
            start: apoc.temporal.format(a.startDate, 'yyyy-MM-dd'),
            end: apoc.temporal.format(a.endDate, 'yyyy-MM-dd'),
            work: round((a.defaultMinutes + a.overtimeMinutes)/60, 2),
            allday: true,
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
            }
        } AS event
    `;
}
