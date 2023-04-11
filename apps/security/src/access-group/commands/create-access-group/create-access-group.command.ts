import { PipedUpsertAccessGroupDto } from "@ns/dto";

export class CreateAccessGroupCommand {
    constructor(
        public readonly dto: PipedUpsertAccessGroupDto,
        public readonly uid: string
    ) {}
}
