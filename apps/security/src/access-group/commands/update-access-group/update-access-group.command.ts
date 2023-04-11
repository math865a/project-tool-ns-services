import { PipedUpsertAccessGroupDto } from "@ns/dto";


export class UpdateAccessGroupCommand {
    constructor(
        public readonly dto: PipedUpsertAccessGroupDto,
        public readonly uid: string
    ) {}
}
