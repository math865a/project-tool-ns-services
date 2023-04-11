import { LinkUserDto } from "@ns/dto";

export class LinkUserCommand {
    constructor(public readonly dto: LinkUserDto, public readonly uid: string){}
}