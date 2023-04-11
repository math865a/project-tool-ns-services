import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { ToggleActiveStatusCommand } from "./toggle-active-status.command";
import { UserActivatedEvent, UserDeactivatedEvent } from "@ns/events";

@CommandHandler(ToggleActiveStatusCommand)
export class ToggleActiveStatusHandler
    implements ICommandHandler<ToggleActiveStatusCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private publisher: DomainEvents
    ) {}

    async execute(command: ToggleActiveStatusCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            uid: command.dto.uid,
            isDeactivated: command.dto.isDeactivated,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            if (command.dto.isDeactivated) {
                this.publisher.publish(
                    new UserDeactivatedEvent(command.dto, command.uid)
                );
                return new FormSuccessResponse({
                    message: "Brugeren blev deaktiveret.",
                });
            } else {
                this.publisher.publish(
                    new UserActivatedEvent(command.dto, command.uid)
                );
                return new FormSuccessResponse({
                    message: "Brugeren blev aktiveret.",
                });
            }
        }
        return new FormErrorResponse({ message: "Der skete en fejl" });
    }

    query = `
        MATCH (u:User)
            WHERE u.uid = $uid
        SET u.isDeactivated = $isDeactivated
    `;
}
