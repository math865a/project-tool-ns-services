import { UpdateFinancialSourceDto } from "@ns/dto";

export class UpdateFinancialSourceCommand {
    constructor(
        public readonly dto: UpdateFinancialSourceDto,
        public readonly uid: string
    ) {}
}

