import { UpdateProjectManagerDto } from "@ns/dto";

export class UpdateProjectManagerCommand{
    constructor(public readonly dto: UpdateProjectManagerDto, public readonly uid: string){}
}