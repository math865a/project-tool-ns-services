import { UpdateDefaultCapacityViewDto } from "@ns/dto";


export class UpdateDefaultCapacityViewCommand {
    constructor(
        public readonly dto: UpdateDefaultCapacityViewDto,
        public readonly uid: string
    ) {}
}
