import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { WorkpackageTeamQuery } from "./workpackage-team.query,";

@QueryHandler(WorkpackageTeamQuery)
export class WorkpackageTeamQueryHandler
    implements IQueryHandler<WorkpackageTeamQuery>
{
    execute(query: WorkpackageTeamQuery): any {
        throw new Error("Method not implemented.");
    }
}
