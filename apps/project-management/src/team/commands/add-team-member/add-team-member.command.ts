import { ICommand } from "@nestjs/cqrs";
import { AddTeamMemberDto } from "@ns/dto";



export class AddTeamMemberCommand implements ICommand {
   constructor(public readonly dto: AddTeamMemberDto, public readonly uid: string){}
};
