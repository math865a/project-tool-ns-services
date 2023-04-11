import { ICommand } from "@nestjs/cqrs";
import { RemoveTeamMemberDto } from "@ns/dto";


export class RemoveTeamMemberCommand implements ICommand {
  constructor(
    public readonly dto: RemoveTeamMemberDto,
    public readonly uid: string,
  ) {}
}
