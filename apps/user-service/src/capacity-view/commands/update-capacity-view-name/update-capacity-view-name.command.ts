import { UpdateCapacityViewNameDto } from "@ns/dto";

export class UpdateCapacityViewNameCommand {
    constructor(
        public readonly dto: UpdateCapacityViewNameDto,
        public readonly uid: string
    ) {}
}
