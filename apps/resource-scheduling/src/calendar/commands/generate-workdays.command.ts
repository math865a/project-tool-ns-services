import { Neo4jClient } from "@ns/neo4j";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DateTime as dt, Interval as int } from 'luxon';
import { capitalize } from 'lodash';

export class GenerateWorkDaysCommand {
    constructor(
        public readonly startDate: string,
        public readonly endDate: string
    ){}
}

@CommandHandler(GenerateWorkDaysCommand)
export class GenerateWorkDaysHandler
    implements ICommandHandler<GenerateWorkDaysCommand>
{
    constructor(private client: Neo4jClient) {}

    async execute(command: GenerateWorkDaysCommand): Promise<any> {
        const days = this.mapDays(command.startDate, command.endDate);
     
        const result = await this.client.write(this.query, {days: days})
        const syncResult = await this.client.write(this.syncCalendarsQuery, {capacity: 480})
        return {done: true}
    }


    mapDays(startDate: string, endDate: string){
        const interval = int.fromDateTimes(
            dt.fromISO(startDate).setZone('utc').setLocale('da'),
            dt.fromISO(endDate).setZone('utc').setLocale('da')
        );
        return interval.splitBy({ days: 1 }).map((date) => {
            let labels: string[] = ["CalendarDay"];
            if ([6,7].includes(date.start.weekday)){
                labels.push("Weekend")
            } else {
                labels.push("BusinessDay")
            }
            const properties = {
                date: date.start.toFormat('yyyy-MM-dd'),
                week: date.start.weekNumber,
                weekdayName: capitalize(date.start.toFormat('cccc')),
                weekday: date.start.weekday,
                year: date.start.year
            }
            return {
                labels: labels,
                properties: properties
            }
        } )
    }


    query = `
        UNWIND $days as day
        CALL apoc.merge.node(day.labels, {
            date: day.properties.date
        })
        YIELD node
        SET node += {
            week: toInteger(day.properties.week),
            weekdayName: day.properties.weekdayName,
            weekday: toInteger(day.properties.weekday),
            year: toInteger(day.properties.year)
        }
    `

    syncCalendarsQuery = `
        MATCH (c:Calendar {isDefault: true})
        CALL {
            WITH c
            MATCH (workdays:BusinessDay)
            UNWIND workdays as day
            MERGE (c)-[rel:HAS_WORKDAY]->(day)
            SET rel.capacity = toInteger($capacity)
        }

    `
  
}
/*        CALL {
            WITH c
            MATCH (offdays:Weekend)
            UNWIND offdays as day
            MERGE (c)-[:HAS_OFFDAY]->(day)
        }*/