import { CapacityFilterDto } from "@ns/dto";


export class CapacityBatchQuery {
    constructor(public readonly dto: CapacityFilterDto) {}
}
