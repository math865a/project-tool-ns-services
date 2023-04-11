import { UpdateCapacityViewDto } from "@ns/dto";


export class UpdateCapacityViewCommand {
    constructor(
        public readonly dto: UpdateCapacityViewDto,
        public readonly uid: string
    ) {}
}
