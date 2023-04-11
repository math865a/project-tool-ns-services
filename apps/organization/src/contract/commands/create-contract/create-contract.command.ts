import { CreateContractDto } from "@ns/dto";


export class CreateContractCommand {
    constructor(
        public readonly dto: CreateContractDto,
        public readonly uid: string
    ) {}
}

