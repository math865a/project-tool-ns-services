import { ResourceCapacityWeeksInstruction } from "@ns/definitions";


export class CapacityDifferenceTimeseriesQuery {
    constructor(
        public readonly instruction: ResourceCapacityWeeksInstruction
    ) {}
}
