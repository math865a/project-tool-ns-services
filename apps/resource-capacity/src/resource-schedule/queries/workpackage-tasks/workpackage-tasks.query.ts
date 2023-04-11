import { ResourceCapacityInstructionsDto } from "@ns/dto";

export class WorkpackageTasksQuery {
    constructor(
        public readonly instruction: ResourceCapacityInstructionsDto,
        public readonly workpackageId: string
    ) {}
}
