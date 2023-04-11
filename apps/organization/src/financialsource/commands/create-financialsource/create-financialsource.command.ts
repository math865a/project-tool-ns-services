import { CreateFinancialSourceDto } from "@ns/dto";


export class CreateFinancialSourceCommand {
    constructor(
        public readonly dto: CreateFinancialSourceDto,
        public readonly uid: string
    ) { }
}

