import { UpdateAllocationDto } from "@ns/dto";

export class UpdateAllocationCommand {
    constructor(
        public readonly dto: UpdateAllocationDto,
        public readonly uid: string
    ) {}
}
