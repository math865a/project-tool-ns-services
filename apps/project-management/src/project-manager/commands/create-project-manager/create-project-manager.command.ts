import { CreateProjectManagerDto } from "@ns/dto";


export class CreateProjectManagerCommand {
    constructor(public readonly dto: CreateProjectManagerDto, public readonly uid: string){}
}