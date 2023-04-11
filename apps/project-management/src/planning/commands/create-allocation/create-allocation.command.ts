import { CreateAllocationDto } from "@ns/dto";

export class CreateAllocationCommand {
    constructor(
        public readonly dto: CreateAllocationDto,
        public readonly uid: string
    ) {}
}
