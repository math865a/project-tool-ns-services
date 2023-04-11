import { PickType } from "@nestjs/mapped-types";
import { ResourceCapacityInstructionsDto } from "@ns/dto";
import { IQueryWeek } from "./query-week.interface";


export class ResourceCapacityWeeksInstruction extends PickType(ResourceCapacityInstructionsDto, ["resourceId"]) {
    public readonly periods: IQueryWeek[]
    
}