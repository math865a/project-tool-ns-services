import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { WorkpackageTimeseriesQuery } from "./workpackage-timeseries.query";

@QueryHandler(WorkpackageTimeseriesQuery)
export class WorkpackageTimeseriesQueryHandler
    implements IQueryHandler<WorkpackageTimeseriesQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute({instruction}: WorkpackageTimeseriesQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, instruction);
        return queryResult.records.map((d) => d.get("bookings"));
    }

    query = `
        MATCH (r:Resource)--(c:Calendar)
            WHERE r.id = $resourceId
        
        UNWIND $periods AS period

        OPTIONAL MATCH (c)-[cal:HAS_WORKDAY]->(workday:CalendarDay)
            WHERE workday.week = period.week AND workday.year = period.year
      
        
        OPTIONAL MATCH (workday)<-[b:HAS_BOOKING]-(a:Allocation)<-[:HAS*4]-(w:Workpackage)--(bs:BookingStage)
            WHERE (a)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(r)
            AND bs.name <> "Ingen"
        
            WITH round(sum(b.duration)/60,1) AS booked, w, period
            WITH [w.systematicName, booked] AS pair, period
            WITH collect(pair) AS pairs, period
            WITH apoc.map.fromPairs(pairs) AS bookingMap, period
            RETURN bookingMap{
                .*,
                week: period.week,
                year: period.year,
                capacity: 40
            } AS bookings
     


        
    
    `;
}
