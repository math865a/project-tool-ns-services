import { AddTeamMemberHandler } from "./add-team-member";
import { RemoveTeamMemberHandler } from "./remove-team-member";
import { SwapTeamMemberHandler } from "./swap-team-member";


export const commandHandlers = [AddTeamMemberHandler, SwapTeamMemberHandler, RemoveTeamMemberHandler]