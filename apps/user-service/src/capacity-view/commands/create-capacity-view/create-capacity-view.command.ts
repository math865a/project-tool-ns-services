import { CreateCapacityViewDto } from "@ns/dto/capacity-view";


export class CreateCapacityViewCommand {
    constructor(
        public readonly dto: CreateCapacityViewDto,
        public readonly uid: string
    ) {}
}
