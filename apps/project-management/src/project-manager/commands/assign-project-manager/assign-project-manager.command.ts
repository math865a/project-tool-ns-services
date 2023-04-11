import { AssignProjectManagerDto } from "@ns/dto";



export class AssignProjectManagerCommand {
    constructor(
        public readonly dto: AssignProjectManagerDto,
        public readonly uid: string
    ) {}
}

