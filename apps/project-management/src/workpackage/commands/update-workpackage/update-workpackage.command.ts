import { UpdateWorkpackageDto } from "@ns/dto";




export class UpdateWorkpackageCommand {
    constructor(
        public readonly dto: UpdateWorkpackageDto,
        public readonly uid: string
    ) {}
}
