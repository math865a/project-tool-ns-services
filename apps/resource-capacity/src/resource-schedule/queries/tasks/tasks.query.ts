import { ScheduleInstruction } from "@ns/definitions";
import { ResourceCapacityInstructionsDto } from "@ns/dto";


export class TasksQuery {
    constructor(
        public readonly instruction: ScheduleInstruction
    ){}



    
    query = `
        MATCH (a:Allocation)--(t:Task)<-[:HAS]-(d:Delivery)<-[:HAS]-(p:Plan)<-[:HAS]-(w:Workpackage)--(bs:BookingStage)
            WHERE (a)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(:Resource {id: $resourceId})
            AND date(a.startDate) <= date($endDate) AND date(a.endDate) >= date($startDate)
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