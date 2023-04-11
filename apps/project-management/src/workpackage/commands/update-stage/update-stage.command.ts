import { UpdateStageDto } from "@ns/dto";

export class UpdateStageCommand {
    constructor(
        public readonly dto: UpdateStageDto,
        public readonly uid: string
    ) {}
}
