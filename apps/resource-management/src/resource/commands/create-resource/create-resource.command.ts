import { CreateResourceDto } from "@ns/dto";


export class CreateResourceCommand {
    constructor(
        public readonly dto: CreateResourceDto,
        public readonly uid: string
    ) {}
}
