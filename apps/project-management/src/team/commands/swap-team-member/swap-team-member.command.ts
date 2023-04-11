import { ICommand } from "@nestjs/cqrs";
import { SwapTeamMemberDto } from "@ns/dto";

export class SwapTeamMemberCommand implements ICommand {
    constructor(
        public readonly dto: SwapTeamMemberDto,
        public readonly uid: string
    ) {}
}
