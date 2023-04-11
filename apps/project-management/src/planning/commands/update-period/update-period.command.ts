import { UpdatePeriodDto } from "@ns/dto";

export class UpdatePeriodCommand {
    constructor(
        public readonly dto: UpdatePeriodDto,
        public readonly uid: string
    ) {}
}
