import { ResourceCapacityInstructionsDto } from "./resource-capacity-instruction";


export class WorkpackageTasksDto extends ResourceCapacityInstructionsDto {
    public readonly workpackageId: string;
}