import { ResourceCapacityWeeksInstruction } from "@ns/definitions";

export class BookingStageTimeseriesQuery {
    constructor(
        public readonly instruction: ResourceCapacityWeeksInstruction
    ) {}
}