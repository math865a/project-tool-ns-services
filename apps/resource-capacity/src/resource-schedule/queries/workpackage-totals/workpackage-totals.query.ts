import { ResourceCapacityInstructionsDto } from "@ns/dto";

export class WorkpackageTotalsQuery {
    constructor(
        public readonly instruction: ResourceCapacityInstructionsDto
    ) {}
}
