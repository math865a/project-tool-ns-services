import { ScheduleInstruction } from "@ns/definitions";

export class ScheduleQuery {
    constructor(public readonly instruction: ScheduleInstruction){}
}