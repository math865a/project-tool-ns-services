import { PipedUpdateActivityDto, UpdateActivityDto } from "@ns/dto";


export class UpdateActivityCommand {
    constructor(public readonly dto: PipedUpdateActivityDto, public readonly uid: string){}
}