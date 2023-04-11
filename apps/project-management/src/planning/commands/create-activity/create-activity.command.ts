import { CreateActivityDto } from "@ns/dto";


export class CreateActivityCommand {
    constructor(
        public readonly dto: CreateActivityDto,
        public readonly uid: string
    ) {}
}
