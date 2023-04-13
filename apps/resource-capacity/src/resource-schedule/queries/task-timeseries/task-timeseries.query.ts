import { ScheduleInstruction } from "@ns/definitions";

export class TaskTimeseriesQuery {
    constructor(public readonly instruction: ScheduleInstruction) {}
}
