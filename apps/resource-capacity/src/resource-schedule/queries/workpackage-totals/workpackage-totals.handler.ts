import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { WorkpackageTotalsQuery } from "./workpackage-totals.query";

@QueryHandler(WorkpackageTotalsQuery)
export class WorkpackageTotalsQueryHandler implements IQueryHandler<WorkpackageTotalsQuery>{
    constructor(private client: Neo4jClient){}

    async execute({instruction}: WorkpackageTotalsQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, instruction)
        return queryResult.records.map(d => d.get("result"))
    }

    query = `
        MATCH (r:Resource)--(c:Calendar)-[:HAS_WORKDAY]->(day:CalendarDay)<-[b:HAS_BOOKING]-(a:Allocation)<-[:HAS*4]-(w:Workpackage)--(bs:BookingStage)
            WHERE r.id = $resourceId
            AND date(day.date) >= date($startDate) AND date(day.date) <= date($endDate)
            AND (a)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(r)
            AND bs.name <> "Ingen"
        
        WITH round(sum(b.duration)/60) AS booked, w, bs
        RETURN {
            id: w.id,
            systematicName: w.systematicName,
            name: w.name,
            bookingStage: bs.name,
            booked: booked
        } AS result
    `
}