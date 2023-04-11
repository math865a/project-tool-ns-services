import { UpdateContractDto } from "@ns/dto";
export class UpdateContractCommand {
    constructor(
        public readonly dto: UpdateContractDto,
        public readonly uid: string
    ) {}
}
