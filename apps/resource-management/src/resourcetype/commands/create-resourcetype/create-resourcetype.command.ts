import { CreateResourceTypeDto } from "@ns/dto";

export class CreateResourceTypeCommand {
    constructor(
        public readonly dto: CreateResourceTypeDto,
        public readonly uid: string
    ) {}
}
