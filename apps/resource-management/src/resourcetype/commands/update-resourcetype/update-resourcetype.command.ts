import { UpdateResourceTypeDto } from "@ns/dto";


export class UpdateResourceTypeCommand {
    constructor(
        public readonly dto: UpdateResourceTypeDto,
        public readonly uid: string
    ) {}
}
