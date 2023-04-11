import { CreateWorkpackageDto } from "@ns/dto";




export class CreateWorkpackageCommand {
    constructor(
        public readonly dto: CreateWorkpackageDto,
        public readonly uid: string
    ) {}
}
