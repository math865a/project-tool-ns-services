import { UpdateUserDetailsDto } from "@ns/dto";



export class UpdateUserDetailsCommand {
    constructor(public readonly dto: UpdateUserDetailsDto, public readonly uid: string){}
}