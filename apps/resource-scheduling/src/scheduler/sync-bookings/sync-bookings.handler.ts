import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { BookingsSyncedEvent } from "@ns/events";
import { SyncBookingsCommand } from "./sync-bookings.command";

@CommandHandler(SyncBookingsCommand)
export class SyncBookingsHandler
    implements ICommandHandler<SyncBookingsCommand, void>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: SyncBookingsCommand): Promise<void> {
        const queryResult = await this.client.write(this.query, {
            allocationId: command.allocationId,
            uid: command.uid,
        });
        const workpackageId: string | undefined =
            queryResult.records[0]?.get("workpackageId");
        const agentId: string | undefined =
            queryResult.records[0]?.get("agentId");
        if (workpackageId && agentId) {
            this.publisher.publish(new BookingsSyncedEvent());
        }
    }

    query = `
        MATCH (w:Workpackage)-[:HAS*4]->(allocation:Allocation)--(a:Agent)--(resource:Resource)--(calendar:Calendar)
            WHERE allocation.id = $allocationId
        CALL {
            WITH allocation
            RETURN allocation.defaultMinutes + allocation.overtimeMinutes AS totalWork
        }
        CALL {
            WITH calendar, allocation
            MATCH (calendar)-[:HAS_WORKDAY]->(day:CalendarDay)
                WHERE date(day.date) >= date(allocation.startDate) AND date(day.date) <= date(allocation.endDate)
            WITH 
                collect(day) as workdays, 
                collect(day{.*}) as workdayProperties
            RETURN workdays, workdayProperties
        }
        CALL {
            WITH workdays, totalWork
            WITH *, size(workdays) AS workdayCount
            RETURN CASE 
                WHEN workdayCount = 0
                    THEN 0
                ELSE round(totalWork/workdayCount,8)
            END AS dailyWork
        }

        CALL {
            WITH workdays, dailyWork, allocation, resource
            UNWIND workdays AS workday
                MERGE (allocation)-[b:HAS_BOOKING]->(workday)
                    SET b.duration = dailyWork
        }
        CALL {
            WITH allocation
            MATCH (allocation)-[r:HAS_BOOKING]->(day:CalendarDay)
                WHERE date(day.date) < date(allocation.startDate) OR date(day.date) > date(allocation.endDate)
            DETACH DELETE r
        }
        RETURN w.id AS workpackageId, a.id AS agentId
`;
}

/*`          
        CALL {
            MATCH (allocation:Allocation)--(:Agent)--(resource:Resource)--(calendar:Calendar)
                WHERE allocation.id = $allocationId
            MATCH (allocation)<-[:HAS*4]-(workpackage:Workpackage)
            RETURN calendar, allocation, resource, workpackage
        }
        CALL {
            WITH allocation
            RETURN allocation.defaultMinutes + allocation.overtimeMinutes AS totalWork
        }
        CALL {
            WITH calendar, allocation
            MATCH (calendar)-[:HAS_WORKDAY]->(day:CalendarDay)
                WHERE date(day.date) >= date(allocation.startDate) AND date(day.date) <= date(allocation.endDate)
            WITH 
                collect(day) as workdays, 
                collect(day{.*}) as workdayProperties
            RETURN workdays, workdayProperties
        }
        CALL {
            WITH workdays, totalWork
            WITH *, size(workdays) AS workdayCount
            RETURN CASE 
                WHEN workdayCount = 0
                    THEN 0
                ELSE totalWork/workdayCount
            END AS dailyWork
        }
        CALL {
            WITH *
            RETURN {
                allocation: allocation.id,
                resource: resource.id,
                workpackage: workpackage.id,
                workdays: workdayProperties,
                dailyWork: dailyWork
            } AS summary
        }
        UNWIND workdays AS workday
        CALL {
            WITH workday, dailyWork, allocation, workpackage, resource
            MERGE (allocation)-[:HAS]->(b:Booking:Activity)-[:ON]->(workday)
            MERGE (b)-[:SOURCE]->(workpackage)
            MERGE (b)-[:BOOKS]->(resource)
            SET b.duration = dailyWork
            RETURN {
                booking: b{.*},
                date: workday.date
            } AS bookingUpsertResult
        }
        CALL {
            WITH allocation
            MATCH (allocation)--(b:Booking)--(day:CalendarDay)
                WHERE date(day.date) < date(allocation.startDate) OR date(day.date) > date(allocation.endDate)
            DETACH DELETE b
        }
        WITH collect(bookingUpsertResult) as upserts, summary
        RETURN {
            summary: summary,
            upserts: upserts
        } AS result 
    `;*/
