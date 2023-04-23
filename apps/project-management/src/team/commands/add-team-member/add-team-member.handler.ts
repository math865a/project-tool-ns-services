import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { TeamMemberAddedEvent } from "@ns/events";
import { AddTeamMemberCommand } from "./add-team-member.command";

@CommandHandler(AddTeamMemberCommand)
export class AddTeamMemberHandler
    implements ICommandHandler<AddTeamMemberCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: AddTeamMemberCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        const result = queryResult.records[0].get("result");
        if (result) {
            this.publisher.publish(new TeamMemberAddedEvent());
            return new FormSuccessResponse({
                message: "Teammedlemmet blev tilføjet.",
            });
        }
        return new FormErrorResponse({
            message: "Der skete en fejl under tilføjelse af teammedlemmet.",
        });
    }

    query = `
        MATCH (w:Workpacakge)-[:HAS]->(p:Plan)
            WHERE w.id = $workpackageId
        MATCH (a:Agent)
            WHERE a.id = $agentId
        MERGE result = (a)-[:IS_ASSIGNED_TO {timestamp: timestamp(), uid: $uid}]->(p)
        RETURN result
    `;
}
