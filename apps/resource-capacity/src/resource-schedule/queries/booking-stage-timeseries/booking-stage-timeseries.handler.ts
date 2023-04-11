import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { BookingStageTimeseriesQuery } from "./booking-stage-timeseries.query";

@QueryHandler(BookingStageTimeseriesQuery)
export class BookingStageTimeseriesQueryHandler
    implements IQueryHandler<BookingStageTimeseriesQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute({instruction}: BookingStageTimeseriesQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, instruction);
        return queryResult.records[0]?.get("result");
    }

    query = `
        MATCH (r:Resource)--(c:Calendar)
        WHERE r.id = $resourceId

        UNWIND $periods AS period
        CALL {
            WITH period, c
            OPTIONAL MATCH (c)-[cap:HAS_WORKDAY]->(day:CalendarDay)
                WHERE day.week = period.week AND day.year = period.year
            WITH collect(day) AS workdays, round(sum(cap.capacity)/60,2) AS capacityDuration
            RETURN workdays, capacityDuration
        }

        CALL {
            WITH workdays, r
            UNWIND workdays AS workday
                MATCH (workday)<-[b:HAS_BOOKING]-(a:Allocation)<-[:HAS*4]-(:Workpackage)--(bStage:BookingStage)
                    WHERE (a)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(r)
                    AND bStage.name <> "Ingen"
            WITH collect({bookingStage: bStage.name, duration: b.duration}) AS bookingMap
            WITH apoc.map.groupByMulti(bookingMap, "bookingStage") AS groupedBookings
            UNWIND keys(groupedBookings) AS key
                UNWIND groupedBookings[key] AS booking
                WITH [key, round(apoc.coll.sum(collect(booking.duration))/60, 2)] AS pair, key
            WITH apoc.map.fromPairs(collect(pair)) AS byBookingStage, collect(key) AS bookingStageKeys
            RETURN byBookingStage
        }

        WITH collect(
            byBookingStage{
            .*,
            week: period.week,
            year: period.year,
            xKey: apoc.text.join([toString(toInteger(period.week)), toString(toInteger(period.year))], "-"),
            capacity: capacityDuration
        }) AS bookings

        CALL {
            WITH bookings
            UNWIND bookings AS booking
                CALL {
                    WITH booking
                    RETURN CASE
                        WHEN booking.Soft IS NULL
                            THEN 0
                        ELSE booking.Soft
                    END AS soft
                }
                CALL {
                    WITH booking
                    RETURN CASE
                        WHEN booking.Hard IS NULL
                            THEN 0
                        ELSE booking.Hard
                    END AS hard
                }
            WITH sum(soft) AS totalSoft, sum(hard) AS totalHard, sum(booking.capacity) AS totalCapacity
            RETURN {
                soft: totalSoft,
                hard: totalHard,
                capacity: totalCapacity
            } AS totals
        }
        RETURN {
            bookings: bookings, 
            totals: totals
        } AS result

    `;
}
